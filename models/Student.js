const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");

const StudentSchema = new mongoose.Schema({
  email: String,
  password: String,
  studentNum: String,
  firstName: String,
  lastName: String,
  gender: String,
  applied: {
    type: Boolean,
    default: false
  },
  phone: String
});

StudentSchema.plugin(passportLocalMongoose);

const Student = new mongoose.model("Student", StudentSchema);

passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());

passport.use(Student.createStrategy());

module.exports = Student;
