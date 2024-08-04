const Student = require("../models/Student");
const Application = require("../models/Application");
const bcrypt = require("bcryptjs");

function getLogin(req, res) {
  if (req.session.user && !req.session.isAdmin) {
    res.redirect("/student/dashboard");
  } else {
    res.render("student/login");
  }
}

async function login(req, res, next) {
  const studentData = req.body;
  const email = studentData.email.toLowerCase();
  const password = studentData.password;

  const existingStudent = await Student.findOne({ email: email }).exec();

  if (!existingStudent) {
    console.log("No user found");
    return res.redirect("/student/login");
  }

  const passwordMatch = await bcrypt.compare(
    password,
    existingStudent.password
  );

  if (!passwordMatch) {
    console.log("Password Incorrect");
    return res.redirect("/student/login");
  }

  console.log("User is authenticated");

  req.session.user = { id: existingStudent._id, email: existingStudent.email };
  req.session.save(() => {
    res.redirect("/student/dashboard");
  });
}

async function updateStudent(req, res) {
  const studentId = req.session.user.id;
  const studentData = req.body;
  const email = studentData.email.toLowerCase();
  const phone = studentData.phone;

  await Student.findOneAndUpdate(
    {
      _id: studentId,
    },
    {
      $set: {
        email: email,
        phone: phone,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.redirect("/student/dashboard");
}

function logout(req, res) {
  req.session.user = null;
  res.redirect("/");
}

async function register(req, res) {
  const studentData = req.body;
  const email = studentData.email.toLowerCase();
  const confirmEmail = studentData.email2.toLowerCase();
  const studentNum = Number(studentData.studentNum);
  const firstName = studentData.firstName;
  const lastName = studentData.lastName;
  const gender = studentData.gender;
  const phone = studentData.phone;
  const password = studentData.password;
  const confirmPassword = studentData.password2;
  const avatar = req.file.path;

  if (
    !email ||
    !confirmEmail ||
    !password ||
    password.trim() < 6 ||
    email !== confirmEmail ||
    password != confirmPassword ||
    !email.includes("@")
  ) {
    console.log("Incorrect data");
    return res.redirect("/student/register");
  }

  const existingStudent = await Student.findOne({ email: email }).exec();

  if (existingStudent) {
    console.log("User exists already");
    return res.redirect("/student/register");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const student = {
    email: email,
    studentNum: studentNum,
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    phone: phone,
    password: hashedPassword,
    avatar: avatar,
  };

  console.log(student)

  await Student.create(student);

  res.redirect("/student/login");
}

async function getDashboard(req, res) {
  const student = req.session.user.id;
  const studentApplication = await Application.findOne({
    createdBy: student,
  });

  if (!req.session.user || req.session.user.isAdmin) {
    return res.status(401).render("shared/401");
  }
  res.render("student/dashboard", { studentApplication: studentApplication });
}

function getRegister(req, res) {
  if (req.session.user && !req.session.isAdmin) {
    res.redirect("/student/dashboard");
  } else {
    res.render("student/register");
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
