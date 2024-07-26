const Application = require("../models/Application");
const Residence = require("../models/Residence");

async function getApply(req, res) {
  const residences = await Residence.find();
  const student = req.user;

  if (req.isAuthenticated()) {
    if (student.applied == false) {
      res.render("student/apply", { residences: residences });
    } else {
      // already applied
      res.redirect("/student/dashboard");
    }
  } else {
    res.redirect("/student/login");
  }
};

async function apply(req, res) {
  const student = req.user;
  const academicRecord = req.file;

  const application = {
    studentNum: Number(student.studentNum),
    studentName: student.firstName + " " + student.lastName,
    residenceOne: req.body.residenceOne,
    residenceTwo: req.body.residenceTwo,
    residenceThree: req.body.residenceThree,
    average: Number(req.body.average),
    documentPath: academicRecord.path,
    createdBy: req.user._id
  };

  const newApplication = new Application(application);


  try {
    await newApplication.save();
    await student.updateOne({
      applied: true,
    });
    res.redirect("/student/dashboard");
  } catch (err) {
    console.log(err);
  }
}


module.exports = {
  getApply,
  apply
};