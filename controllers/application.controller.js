const Application = require("../models/Application");
const database = require("../config/database").MongoURI;

function getApply(req, res) {
  const student = req.user;

  if (req.isAuthenticated()) {
    if (student.applied == false) {
      res.render("apply");
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
    average: Number(req.body.average),
    documentPath: academicRecord.path,
  };

  const newApplication = new Application(application);

  try {
    await student.updateOne({
      applied: true,
    });
    await newApplication.save();
    res.redirect("/student/dashboard");
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getApply: getApply,
  apply: apply,
};