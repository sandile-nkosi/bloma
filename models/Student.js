const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");

const StudentSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  studentNum: {
    type: Number,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  gender: {
    type: String,
  },
  applied: {
    type: Boolean,
    default: false
  }
});

StudentSchema.plugin(passportLocalMongoose);

const Student = new mongoose.model("Student", StudentSchema);

passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());

passport.use(Student.createStrategy());

module.exports = Student;
