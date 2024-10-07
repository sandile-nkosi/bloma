const Application = require("../models/Application");
const Residence = require("../models/Residence");
const Student = require("../models/Student");
const sendMail = require("../middleware/mailer");

async function getResidences(req, res) {
  try {
    const residences = await Residence.find();
    res.render("shared/residences", { residences });
  } catch (err) {
    console.log(err);
    return res.status(401).render("shared/401");
  }
}

async function getSingleResidence(req, res) {
  if (req.session.user && !req.session.user.isAdmin) {
    try {
      const singleResidence = await Residence.findById(req.params.id).exec();
      const student = await Student.findById(req.session.user.id).exec();

      res.render("shared/residence", {
        singleResidence,
        student,
      });
    } catch (err) {
      console.log(err);
      return res.status(401).render("shared/401");
    }
  }else {
    res.redirect('/student/login');
  }
}

async function addResidence(req, res) {
  try {
    const student = await Student.findById(req.session.user.id).exec();
    const singleResidence = await Residence.findById(req.params.id).exec();
    const studentApplication = await Application.findOne({
      createdBy: student._id,
    }).exec();

    if (student.applications == 0) {
      await Application.findOneAndUpdate(
        {
          createdBy: student._id,
        },
        {
          $set: {
            residenceOne: singleResidence.title,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await Student.findOneAndUpdate(
        {
          _id: student._id,
        },
        {
          $set: {
            applications: 1,
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
        subject: "New Residence Application",
        text: `
        Dear ${studentApplication.studentName}
        Your application for residence at a NWU Mafikeng Residence has been submitted. Please login to Bloma to view any updates.
        Regards
        NWU MFK Residence Management`,
        html: `
        <h4>Dear ${studentApplication.studentName}</h4>
        <p>Your application for residence at a NWU Mafikeng Residence has been submitted. Please login to Bloma to view any updates.</p>
        <p>Regards</p>
        NWU MFK Residence Management`,
      };
  
      sendMail(mailOptions).then((result)=>{
        console.log(result);
      }).catch((err)=>{
        console.log(err);
      });

      return res.redirect("/student/dashboard");
    } else if (
      student.applications == 1 &&
      studentApplication.residenceOne != singleResidence.title
    ) {
      await Application.findOneAndUpdate(
        {
          createdBy: student._id,
        },
        {
          $set: {
            residenceTwo: singleResidence.title,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await Student.findOneAndUpdate(
        {
          _id: student._id,
        },
        {
          $set: {
            applications: 2,
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
        subject: "New Residence Application",
        text: `
        Dear ${studentApplication.studentName}
        Your application for residence at a NWU Mafikeng Residence has been submitted. Please login to Bloma to view any updates.
        Regards
        NWU MFK Residence Management`,
        html: `
        <h4>Dear ${studentApplication.studentName}</h4>
        <p>Your application for residence at a NWU Mafikeng Residence has been submitted. Please login to Bloma to view any updates.</p>
        <p>Regards</p>
        NWU MFK Residence Management`,
      };
  
      sendMail(mailOptions).then((result)=>{
        console.log(result);
      }).catch((err)=>{
        console.log(err);
      });

      return res.redirect("/student/dashboard");
    } else if (
      student.applications == 2 &&
      studentApplication.residenceOne != singleResidence.title &&
      studentApplication.residenceTwo != singleResidence.title
    ) {
      await Application.findOneAndUpdate(
        {
          createdBy: student._id,
        },
        {
          $set: {
            residenceThree: singleResidence.title,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await Student.findOneAndUpdate(
        {
          _id: student._id,
        },
        {
          $set: {
            applications: 3,
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
        subject: "New Residence Application",
        text: `
        Dear ${studentApplication.studentName}
        Your application for residence at a NWU Mafikeng Residence has been submitted. Please login to Bloma to view any updates.
        Regards
        NWU MFK Residence Management`,
        html: `
        <h4>Dear ${studentApplication.studentName}</h4>
        <p>Your application for residence at a NWU Mafikeng Residence has been submitted. Please login to Bloma to view any updates.</p>
        <p>Regards</p>
        NWU MFK Residence Management`,
      };
  
      sendMail(mailOptions).then((result)=>{
        console.log(result);
      }).catch((err)=>{
        console.log(err);
      });

      return res.redirect("/student/dashboard");
    }
    res.redirect("/student/dashboard");
  } catch (err) {
    console.log(err);
  }
}

// to insert new residence in the database

async function newResidence(req, res) {
  const residenceImage = req.file;

  const residence = {
    title: req.body.title,
    description: req.body.description,
    rooms: req.body.rooms,
    roomsType: req.body.roomsType,
    gender: req.body.gender,
    imagePath: residenceImage.path,
  };

  const newResidence = new Residence(residence);

  try {
    await newResidence.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
    return res.status(401).render("shared/401");
  }
}

module.exports = {
  getResidences,
  getSingleResidence,
  addResidence,
  newResidence,
};
