const Student = require("../models/Student");
const Application = require("../models/Application");
const passport = require("passport");

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
  const { email, phone } = req.body;

  const updateStudent = req.body;

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
  console.log(err);
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
    avatar: req.file.path,
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

async function getDashboard(req, res) {
  if (req.isAuthenticated()) {
    const student = req.user;
    const studentApplication = await Application.findOne({
      createdBy: student._id,
    }).exec();

    res.render("dashboard", {
      student: student,
      studentApplication: studentApplication,
    });
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
  getLogin,
  getDashboard,
  getRegister,
  login,
  logout,
  register,
  updateStudent,
};
