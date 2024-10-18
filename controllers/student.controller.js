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
    res.render("student/login", { errorMsg });
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
      errorMsg = "No user found";
      return res.redirect("/student/login");
    }

    const passwordMatch = await bcrypt.compare(
      password,
      existingStudent.password
    );

    if (!passwordMatch) {
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
    errorMsg = "Incorrect data. Please try again";
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
      return res.render("student/register", { errorMsg });
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

    sendMail(mailOptions)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
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
    res.render("student/register", { errorMsg });
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
  const generatedOtp = randomstring.generate(12);
  let resetPasswordLink = `http://13.245.80.172:443/student/update-password/${studentEmail}/${generatedOtp}`;

  try {
    const duplicateOtp = await Otp.findOne({
      studentEmail: studentEmail,
    }).exec();

    if (duplicateOtp) {
      console.log("Please wait 5 minutes before requesting a new OTP");
      return res.redirect("/student/forgot-password");
    }

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
      expireAt: Date.now() + 0.5 * 24 * 60 * 60 * 8,
    };

    await Otp.create(otp);

    const mailOptions = {
      from: "do not reply <blomaresidence@gmail.com>",
      to: studentEmail,
      subject: "Password Reset",
      text: `
      Forgot your password? It happens to the best of us.Follow the link to reset your password ${resetPasswordLink}. The link is valid for 5 minutes.
      If you didn't request a password change, you can ignore this email.
      Regards,
      NWU MFK Residence Management`,
      html: `
      <p>Forgot your bloma password? It happens to the best of us. Follow the link to reset your password: 
      <p style="color:red;font-size:25px;letter-spacing:2px;"><b>${resetPasswordLink}</b></p> <p>The link is valid for 5 minutes.
      If you didn't request a password change, you can ignore this email.</p>
      <p>Regards</p>
      NWU MFK Residence Management`,
    };

    sendMail(mailOptions).then((result)=>{
      console.log(result);
    }).catch((err) => {
        console.log(err);
      });

    res.redirect("/");
  } catch (err) {
    console.log(err);
    return res.status(401).render("shared/401");
  }
}

function getUpdatePassword(req, res) {
  const email = req.params.email;
  const newOtp = req.params.otp;

  res.render("student/update-password", { newOtp, email });
}

async function updatePassword(req, res) {
  const email = req.params.email;
  const newOtp = req.params.otp;
  const password = req.body.password;
  const confirmPassword = req.body.password2;

  try {
    const existingOtp = await Otp.findOne({
      studentEmail: email,
    }).exec();

    const otpMatch = await bcrypt.compare(newOtp, existingOtp.otp);

    if (!otpMatch) {
      console.log("Otp Incorrect - try again");
      return res.redirect("/student/forgot-password");
    }

    if (
      !password ||
      password.trim() < 6 ||
      password != confirmPassword
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
      await Otp.deleteOne({
        email: email
      });
      res.redirect("/");
    } catch (err) {
      console.log(err);
      return res.status(401).render("shared/401");
    }
  } catch (err) {
    console.log(err);
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
  sendOtp,
  getUpdatePassword,
  updatePassword,
};
