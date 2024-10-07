const Application = require("../models/Application");
const Residence = require("../models/Residence");
const Student = require("../models/Student");
const sendMail = require("../middleware/mailer");

// residence status variables
const accepted = "Accepted";
const completed = "Completed";

async function getApply(req, res) {
  if (req.session.user && !req.session.isAdmin) {
    try {
      const student = await Student.findById(req.session.user.id).exec();

      if (req.session.user && !req.session.user.isAdmin) {
        if (student.applications  == 0 && !student.applied) {
          return res.render("student/apply");
        } 

        if(student.applications  <= 3 && student.applied){
          return res.redirect("/residences");
        } else {
          return res.redirect("/student/dashboard");
        }    
        
      } else {
        return res.redirect("/student/login");
      }
    } catch (err) {
      console.log(err);
      return res.status(401).render("shared/401");
    }
  } else {
    return res.status(401).render("shared/401");
  }
}

async function apply(req, res) {
  try {
    const student = await Student.findById(req.session.user.id).exec();
    const academicRecord = req.file;

    if(!academicRecord){
      console.log("No academic record");
      return res.redirect('/application/apply');
    };

    const application = {
      studentNum: Number(student.studentNum),
      studentName: student.firstName + " " + student.lastName,
      academicYear: Number(req.body.academicYear),
      typeOfStudy: req.body.typeOfStudy,
      disability: req.body.disability,
      disabilityDetails: req.body.disabilityDetails,
      applicationStatus: req.body.applicationStatus,
      applicationYear: Number(req.body.applicationYear),
      average: Number(req.body.average),
      documentPath: academicRecord.path,
      createdBy: student._id,
    };

    

    const newApplication = new Application(application);

    await newApplication.save();
    await student.updateOne({
      applied: true,
    });

    const studentApplication = await Application.findOne({
      createdBy: student._id,
    }).exec();

    if (studentApplication.average >= 75) {
      await studentApplication.updateOne({
        residenceOneStatus: "Conditionally Accepted",
      });
    }

    const mailOptions = {
      from: "do not reply <blomaresidence@gmail.com>",
      to: student.email,
      subject: "New Residence Application",
      text: `
      Dear ${studentApplication.studentName}
      Thank you for creating an account and submitting your application information regarding accommodation at NWU Mafikeng residences. Remember to make your residence choices from your dashboard.
      Regards
      NWU MFK Residence Management`,
      html: `
      <h4>Dear ${studentApplication.studentName}</h4>
      <p>Thank you for creating an account and submitting your application information regarding accommodation at NWU Mafikeng residences. Remember to make your residence choices from your dashboard.</p>
      <p>Regards</p>
      NWU MFK Residence Management`,
    };

    sendMail(mailOptions).then((result)=>{
      console.log(result);
    }).catch((err)=>{
      console.log(err);
    });

    return res.redirect("/student/dashboard");
  } catch (err) {
    console.log(err);
    return res.status(401).render("shared/401");
  }
}

async function getApplications(req, res) {
  try {
    const allApplications = await Application.find({}).sort({ _id: -1 });
    const totalApplications = await Application.estimatedDocumentCount();

    if (req.session.user || req.session.user.isAdmin) {
      return res.render("admin/applications", { allApplications, totalApplications });
    } else {
      return res.redirect("/admin/dashboard");
    }
  } catch (error) {
    console.log(err);
    return res.status(401).render("shared/401");
  }
}

async function getSingleApplication(req, res) {
  try {
    const singleApplication = await Application.findById(req.params.id).exec();
    const student = await Student.findById(singleApplication.createdBy).exec();

    return res.render("admin/single-application", {
      singleApplication, student
    });
  } catch (err) {
    console.log(err);
    return res.status(401).render("shared/401");
  }
}

async function updateApplication(req, res) {
  const applicationId = req.params.id;
  const applicationData = req.body;
  const applicationComment = req.body.comments
  try {
    const studentApplication = await Application.findById(applicationId).exec();
    const student = await Student.findById(studentApplication.createdBy).exec();
    let roomUpdate = 0;

    const updatedApplication = {
      residenceOneStatus: applicationData.residenceOneStatus,
      residenceTwoStatus: applicationData.residenceTwoStatus,
      residenceThreeStatus: applicationData.residenceThreeStatus,
      comments: applicationComment
    };

    if (updatedApplication.residenceOneStatus == accepted) {
      updatedApplication.residenceTwoStatus = completed;
      updatedApplication.residenceThreeStatus = completed;
      updateResidenceRooms();
    } else if (updatedApplication.residenceTwoStatus == accepted) {
      updatedApplication.residenceOneStatus = completed;
      updatedApplication.residenceThreeStatus = completed;
      updateResidenceRooms();
    } else if (updatedApplication.residenceThreeStatus == accepted) {
      updatedApplication.residenceOneStatus = completed;
      updatedApplication.residenceTwoStatus = completed;
      updateResidenceRooms();
    }

    async function updateResidenceRooms() {
      let residenceRoomTitleToUpdate = "";

      if (updatedApplication.residenceOneStatus == accepted) {
        residenceRoomTitleToUpdate = studentApplication.residenceOne;
        roomUpdate++;
      } else if (updatedApplication.residenceTwoStatus == accepted) {
        residenceRoomTitleToUpdate = studentApplication.residenceTwo;
        roomUpdate++;
      } else {
        residenceRoomTitleToUpdate = studentApplication.residenceThree;
        roomUpdate++;
      }

      await Residence.findOneAndUpdate(
        {
          title: residenceRoomTitleToUpdate,
        },
        {
          $set: {
            acceptedApplications: roomUpdate,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    await Application.findOneAndUpdate(
      {
        _id: applicationId,
      },
      {
        $set: {
          residenceOneStatus: updatedApplication.residenceOneStatus,
          residenceTwoStatus: updatedApplication.residenceTwoStatus,
          residenceThreeStatus: updatedApplication.residenceThreeStatus,
          comments: updatedApplication.comments
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    const mailOptions = {
      from: "do not reply <blomaresidence@gmail.com>",
      to: student.email,
      subject: "Residence Application Update",
      text: `
      Dear ${studentApplication.studentName}
      Your application status for residence at a NWU Mafikeng Residence has been updated. Please login to Bloma to view the update.
      Regards
      NWU MFK Residence Management`,
      html: `
      <h4>Dear ${studentApplication.studentName}</h4>
      <p>Your application status for residence at a NWU Mafikeng Residence has been updated. Please login to Bloma to view the update.</p>
      <p>Regards</p>
      NWU MFK Residence Management`,
    };

    sendMail(mailOptions).then((result)=>{
      console.log(result);
    }).catch((err)=>{
      console.log(err);
    });

    return res.redirect("/admin/dashboard");
  } catch (err) {
    console.log(err);
    return res.status(401).render("shared/401");
  }
}

module.exports = {
  getApply,
  apply,
  getApplications,
  getSingleApplication,
  updateApplication,
};

