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

async function updateStudent(req, res) {
  const studentId = req.user._id;
  const { firstName, lastName, phone, avatar } = req.body;

  const updateStudent = req.body;
  try {
    await Student.findOneAndUpdate(
      {
        _id: studentId,
      },
      {
        $set: updateStudent,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.redirect("/student/dashboard");
  } catch (err) {
    console.log(err);
  }
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
  getRegister: getRegister,
  login: login,
  logout: logout,
  register: register,
  updateStudent: updateStudent,
};
