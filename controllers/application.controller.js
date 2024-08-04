const { application } = require("express");
const Application = require("../models/Application");
const Residence = require("../models/Residence");
const Student = require("../models/Student");

async function getApply(req, res) {
  const residences = await Residence.find();
  const student = await Student.findById(req.session.user.id).exec();

  if (req.session.user && !req.session.user.isAdmin) {
    if (student.applied == false) {
      res.render("student/apply", { residences: residences });
    } else {
      res.redirect("/student/dashboard");
    }
  } else {
    res.redirect("/student/login");
  }
}

async function apply(req, res) {
  const student = await Student.findById(req.session.user.id).exec();
  const academicRecord = req.file;

  const application = {
    studentNum: Number(student.studentNum),
    studentName: student.firstName + " " + student.lastName,
    residenceOne: req.body.residenceOne,
    residenceTwo: req.body.residenceTwo,
    residenceThree: req.body.residenceThree,
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

  res.redirect("/student/dashboard");
}

async function getApplications(req, res){
  const allApplications = await Application.find({}).sort({ _id: -1});


  

  if(req.session.user || req.session.user.isAdmin){
    res.render('admin/applications', { allApplications: allApplications });
  } else {
    res.redirect("/admin/dashboard");
  }
}

async function getSingleApplication(req, res){
  const singleApplication = await Application.findById(req.params.id).exec();

  res.render('admin/single-application', {
    singleApplication: singleApplication
  });

};

async function updateApplication(req, res) {
  const applicationId = req.params.id;
  const applicationData = req.body;
  const singleApplication = await Application.findById(req.params.id).exec();
  
  const updatedApplication = {
    residenceOneStatus : applicationData.residenceOneStatus,
    residenceTwoStatus : applicationData.residenceTwoStatus,
    residenceThreeStatus : applicationData.residenceThreeStatus
  };

  if(updatedApplication.residenceOneStatus == "Accepted"){
    updatedApplication.residenceTwoStatus = "Completed";
    updatedApplication.residenceThreeStatus = "Completed";
  }else if(updatedApplication.residenceTwoStatus == "Accepted"){
    updatedApplication.residenceOneStatus = "Completed";
    updatedApplication.residenceThreeStatus = "Completed";
  }else if(updatedApplication.residenceThreeStatus == "Accepted"){
    updatedApplication.residenceOneStatus = "Completed";
    updatedApplication.residenceTwoStatus = "Completed";
  }
  await Application.findOneAndUpdate(
    {
      _id: applicationId,
    },
    {
      $set: {
        residenceOneStatus: updatedApplication.residenceOneStatus,
        residenceTwoStatus: updatedApplication.residenceTwoStatus,
        residenceThreeStatus: updatedApplication.residenceThreeStatus
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );


  //await Residence.findOne({ title:  }).exec();


  res.redirect('/application/all');
   
}


module.exports = {
  getApply,
  apply,
  getApplications,
  getSingleApplication,
  updateApplication
};
