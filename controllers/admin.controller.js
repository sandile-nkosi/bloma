const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Application = require("../models/Application");
const bcrypt = require("bcryptjs");

function getAdminLogin(req, res) {
  if (req.session.user && req.session.user.isAdmin) {
    res.redirect("/admin/dashboard");
  } else {
    res.render("admin/login");
  }
}

async function adminLogin(req, res, next) {
  res.render("admin/login");
}

async function adminLogin(req, res, next) {
  const adminData = req.body;
  const username = adminData.username;
  const password = adminData.password;

  const existingAdmin = await Admin.findOne({ username: username }).exec();

  if (!existingAdmin) {
    console.log("No user found");
    return res.redirect("/admin/login");
  }

  const passwordMatch = await bcrypt.compare(password, existingAdmin.password);

  if (!passwordMatch) {
    console.log("Password Incorrect");
    return res.redirect("/admin/login");
  }

  console.log("User is authenticated");

  req.session.user = {
    id: existingAdmin._id,
    username: existingAdmin.username,
    isAdmin: existingAdmin.isAdmin,
  };
  req.session.save(() => {
    res.redirect("/admin/dashboard");
  });
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
}

async function getAdminDashboard(req, res) {

  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(401).render("shared/401");
  }
  res.render("admin/dashboard");
}

module.exports = {
  getAdminLogin,
  getAdminDashboard,
  getAdminRegister,
  adminLogin,
  adminLogout,
  adminRegister,
};
