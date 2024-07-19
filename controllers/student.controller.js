const Student = require("../models/Student");
const Application = require("../models/Application");
const passport = require("passport");
const database = require("../config/database").MongoURI;

function getLogin(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render("login");
  }
}

function login(req, res, next) {
  const student = new Student({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(student, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/student/dashboard");
      });
    }
  });
}

function logout(req, res) {
  req.logout((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
}

function register(req, res) {
  const student = {
    username: req.body.username,
    studentNum: Number(req.body.studentNum),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    gender: req.body.gender,
    phone: req.body.phone,
  };

  Student.register(new Student(student), req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect("/student/register");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/student/login");
      });
    }
  });
}

function getDashboard(req, res) {
  if (req.isAuthenticated()) {
    const student = req.user;
    res.render("dashboard", { student: student });
  } else {
    res.redirect("/student/login");
  }
}

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
}

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

function getRegister(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render("register");
  }
}

module.exports = {
  getLogin: getLogin,
  getDashboard: getDashboard,
  getApply: getApply,
  getRegister: getRegister,
  login: login,
  logout: logout,
  register: register,
  apply: apply,
};
