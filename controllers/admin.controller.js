// const Admin = require("../models/Admin");
// const Application = require("../models/Application");
// const passport = require("passport");

// function getLogin(req, res) {
//   if (req.isAuthenticated()) {
//     res.redirect("admin/admin.dashboard");
//   } else {
//     res.render("admin/admin.login");
//   }
// }

// function login(req, res, next) {
//   const admin = new Admin({
//     username: req.body.username,
//     password: req.body.password,
//   });

//   req.login(admin, (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       passport.authenticate("local")(req, res, () => {
//         res.redirect("admin/admin.dashboard");
//         console.log("User logged in: " + req.user.username);
//       });
//     }
//   });
// }

// function logout(req, res) {
//   req.logout((err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.redirect("/");
//     }
//   });
// }

// function getRegister(req, res) {
//   if (req.isAuthenticated()) {
//     res.redirect("admin/admin-dashboard");
//   } else {
//     res.render("admin/admin.register");
//   }
// }

// function register(req, res) {
//   Admin.register({username: req.body.username}, req.body.password, (err, admin) => {
//     if (err) {
//       console.log(err);
//       res.redirect("/admin/register");
//     } else {
//       passport.authenticate("local")(req, res, () => {
//         res.redirect("/admin-login");
//       });
//     }
//   });
// }

// async function getDashboard(req, res) {
//   // if (req.isAuthenticated()) {
//     const admin = req.user;
//     const allApplications = await Application.find({});

//     res.render("admin/admin.dashboard", {allApplications: allApplications});
//   // } else {
//   //   res.redirect("admin/admin-login");
//   // }
// }

// module.exports = {
//   getLogin,
//   getDashboard,
//   getRegister,
//   login,
//   logout,
//   register,
// };