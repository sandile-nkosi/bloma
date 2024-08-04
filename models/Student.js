const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    studentNum: Number,
    firstName: String,
    lastName: String,
    gender: String,
    phone: Number,
    applied: {
      type: Boolean,
      default: false,
    },
    phone: String,
    avatar: {
      type: String,
      default: "/images/user.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Student = new mongoose.model("Student", StudentSchema);

module.exports = Student;
