const Student = require("../models/Student");
const Application = require("../models/Application");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const sendMail = require("../middleware/mailer");
const randomstring = require("randomstring");
let errorMsg = "";

function getLogin(req, res) {
  if (req.session.user && !req.session.isAdmin) {
    res.redirect("/student/dashboard");
  } else {
    res.render("student/login", {errorMsg});
  }
}

async function login(req, res, next) {
  const studentData = req.body;
  const email = studentData.email.toLowerCase();
  const password = studentData.password;

  try {
    errorMsg = "";
    const existingStudent = await Student.findOne({ email: email }).exec();
    if (!existingStudent) {
      console.log("No user found");
      errorMsg = "No user found";
      return res.redirect("/student/login");
    }

    const passwordMatch = await bcrypt.compare(
      password,
      existingStudent.password
    );

    if (!passwordMatch) {
      console.log("Password Incorrect");
      errorMsg = "Password Incorrect";
      return res.redirect("/student/login");
    }
    
    req.session.user = {
      id: existingStudent._id,
      email: existingStudent.email,
    };
    req.session.save(() => {
      return res.redirect("/student/dashboard");
    });
  } catch (err) {
    console.log(err);
    return res.status(401).render("shared/401");
  }
}

async function updateStudent(req, res) {
  const studentId = req.session.user.id;
  const studentData = req.body;
  const email = studentData.email.toLowerCase();
  const phone = studentData.phone;

  try {
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
  } catch (err) {
    console.log(err);
    return res.status(401).render("shared/401");
  }
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
  errorMsg = "";

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
    errorMsg = 'Incorrect data. Please try again';
    return res.redirect("/student/register");
  }

  try {
    const existingStudentEmail = await Student.findOne({ email: email }).exec();
    const existingStudentNumber = await Student.findOne({
      studentNum: studentNum,
    }).exec();

    if (existingStudentEmail || existingStudentNumber) {
      errorMsg = "Email or Student number already exists";
      console.log(errorMsg);
      return res.render("student/register", {errorMsg});
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
    };

    await Student.create(student);

    const mailOptions = {
      from: "do not reply <blomaresidence@gmail.com>",
      to: student.email,
      subject: "Welcome to Bloma",
      text: `
      Dear ${student.firstName}
      Welcome to Bloma! You can now easily browse our web application to find your next on campus residence. Login now to get started.
      Regards
      NWU MFK Residence Management`,
      html: `
      <h4>Dear ${student.firstName}</h4>
      <p>Welcome to Bloma! You can now easily browse our web application to find your next on campus residence. Login now to get started.</p>
      <p>Regards</p>
      NWU MFK Residence Management`,
    };

    sendMail(mailOptions);
    errorMsg = "";
    res.redirect("/student/login");
  } catch (err) {
    console.log(err);
    return res.status(401).render("shared/401");
  }
}

async function getDashboard(req, res) {
  if (!req.session.user || req.session.user.isAdmin) {
    return res.status(401).render("shared/401");
  }

  try {
    const loggedInStudent = req.session.user.id;
    const student = await Student.findById(loggedInStudent).exec();
    const studentApplication = await Application.findOne({
      createdBy: loggedInStudent,
    });

    res.render("student/dashboard", {
      studentApplication,
      student,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).render("shared/401");
  }
}

function getRegister(req, res) {
  if (req.session.user && !req.session.isAdmin) {
    res.redirect("/student/dashboard");
  } else {
    res.render("student/register", {errorMsg});
  }
}

function getForgotPassword(req, res) {
  if (req.session.user || req.session.isAdmin) {
    return res.status(401).render("shared/401");
  }
  res.render("student/forgot-password");
}

async function sendOtp(req, res) {
  const studentEmail = req.body.email;
  const generatedOtp = randomstring.generate(6);

  try {
    const existingStudent = await Student.findOne({
      email: studentEmail,
    }).exec();

    if (!existingStudent) {
      console.log("Email or Student number does not exist");
      return res.redirect("/student/forgot-password");
    }

    const hashedOtp = await bcrypt.hash(generatedOtp, 12);

    const otp = {
      otp: hashedOtp,
      studentEmail: studentEmail,
      createdAt: Date.now(),
      expiresAt: Date.now() + 120
    };

    await Otp.create(otp);

    const mailOptions = {
      from: "do not reply <blomaresidence@gmail.com>",
      to: studentEmail,
      subject: "Password Reset",
      text: `
      Forgot your password? It happens to the best of us.Your otp is ${generatedOtp}. The OTP is valid for 5 minutes.
      If you didn't request a password change, you can ignore this email.
      Regards,
      NWU MFK Residence Management`,
      html: `
      <p>Forgot your bloma password? It happens to the best of us. Your otp is: 
      <p style="color:red;font-size:25px;letter-spacing:2px;"><b>${generatedOtp}</b></p>. <p>The OTP is valid for 5 minutes.
      If you didn't request a password change, you can ignore this email.</p>
      <p>Regards</p>
      NWU MFK Residence Management`,
    };

    sendMail(mailOptions);

    res.redirect("/student/forgot-password");
    console.log("otp sent");
  } catch (err) {
    console.log(err);
    return res.status(401).render("shared/401");
  }
}

async function forgotPassword(req, res) {
  const enteredOtp = req.body.otp;

  const passwordMatch = await bcrypt.compare(
    enteredOtp,
    existingStudent.password
  );

  try {

    const existingotp = await Otp.findOne({ email: email }).exec();
    
    const storedOtp = await Otp.findOne({ otp: enteredOtp }).exec();

    if (!storedOtp) {
      console.log("Otp Incorrect - try again");
      return res.redirect("/student/forgot-password");
    }

    res.redirect("/student/update-password");

    console.log("OTP correct - change passwords!");
  } catch (err) {
    console.log(err);
    return res.status(401).render("shared/401");
  }
}

function getUpdatePassword(req, res) {
  res.render("student/update-password");
}

async function updateStudentPassword(req, res) {
  const studentData = req.body;
  const email = studentData.email.toLowerCase();
  const password = studentData.password;
  const confirmPassword = studentData.password2;

  if (
    !email ||
    !password ||
    password.trim() < 6 ||
    password != confirmPassword ||
    !email.includes("@")
  ) {
    console.log("Incorrect data");
    return res.redirect("/student/update-password");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    await Student.findOneAndUpdate(
      {
        email: email,
      },
      {
        $set: {
          password: hashedPassword,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    console.log("Password updated");

    res.redirect("/");
  } catch (err) {
    console.log(err);
    return res.status(401).render("shared/401");
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
  getForgotPassword,
  forgotPassword,
  sendOtp,
  getUpdatePassword,
  updateStudentPassword,
};
