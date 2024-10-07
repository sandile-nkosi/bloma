const Admin = require("../models/Admin");
const Application = require("../models/Application");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
let errorMsg = "";

function getAdminLogin(req, res) {
  if (req.session.user && req.session.user.isAdmin) {
    res.redirect("/admin/dashboard");
  } else {
    res.render("admin/login", { errorMsg });
  }
}

async function adminLogin(req, res, next) {
  res.render("admin/login");
}

async function adminLogin(req, res, next) {
  const adminData = req.body;
  const username = adminData.username;
  const password = adminData.password;
  errorMsg = "";

  try {
    const existingAdmin = await Admin.findOne({ username: username }).exec();

    if (!existingAdmin) {
      errorMsg = "No user found";
      return res.redirect("/admin/login");
    }

    const passwordMatch = await bcrypt.compare(
      password,
      existingAdmin.password
    );

    if (!passwordMatch) {
      errorMsg = "Password Incorrect";
      return res.redirect("/admin/login");
    }

    req.session.user = {
      id: existingAdmin._id,
      username: existingAdmin.username,
      isAdmin: existingAdmin.isAdmin,
    };
    req.session.save(() => {
      res.redirect("/admin/dashboard");
    });
  } catch (err) {
    console.log(err);
    return res.status(401).render("shared/401");
  }
}

function adminLogout(req, res) {
  req.session.user = null;
  res.redirect("/");
}

function getAdminRegister(req, res) {
  if (req.session.user && req.session.user.isAdmin) {
    res.redirect("/admin/dashboard");
  } else {
    res.render("admin/register");
  }
}

async function adminRegister(req, res) {
  const adminData = req.body;
  const username = adminData.username;
  const password = adminData.password;
  const confirmPassword = adminData.password2;

  if (
    !username ||
    !password ||
    password.trim() < 6 ||
    password != confirmPassword
  ) {
    console.log("Incorrect data");
    return res.redirect("/admin/register");
  }

  try {
    const existingAdmin = await Admin.findOne({ username: username }).exec();

    if (existingAdmin) {
      console.log("User exists already");
      return res.redirect("/admin/register");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = {
      username: username,
      password: hashedPassword,
    };

    await Admin.create(admin);

    res.redirect("/admin/login");
  } catch (err) {
    console.log(err);
    return res.status(401).render("shared/401");
  }
}

async function getAdminDashboard(req, res) {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(401).render("shared/401");
  }
  const applications = await Application.find();
  const applicationTotal = await Application.countDocuments();

  res.render("admin/dashboard", { applications, applicationTotal });
}

async function search(req, res){
  let keyword = Number(req.body.search);

  try {
    const student = await Student.findOne({ studentNum: keyword }).exec();
    const singleApplication = await Application.findOne({ 'studentNum': keyword });
    if(singleApplication){
      return res.render("admin/single-application", { singleApplication, student });
    }else {
      res.redirect("/admin/dashboard");
    }   
  } catch (err) {
    console.log('An error with the search occured')
  }
  
}

module.exports = {
  getAdminLogin,
  getAdminDashboard,
  getAdminRegister,
  adminLogin,
  adminLogout,
  adminRegister,
  search
};