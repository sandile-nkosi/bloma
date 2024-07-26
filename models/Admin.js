// const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");
// const passport = require("passport");

// const AdminSchema = new mongoose.Schema({
//   email: String,
//   password: String,
//   isAdmin: {
//     type: Boolean,
//     default: true
//   }
// },
// {
//   timestamps: true 
// });

// AdminSchema.plugin(passportLocalMongoose);

// const Admin = new mongoose.model("Admin", AdminSchema);

// passport.serializeUser(Admin.serializeUser());
// passport.deserializeUser(Admin.deserializeUser());

// passport.use(Admin.createStrategy());

// module.exports = Admin;