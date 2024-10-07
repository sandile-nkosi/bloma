const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true
    },
    password: String,
    studentNum: {
      type: Number,
      unique: true
    },
    firstName: String,
    lastName: String,
    gender: String,
    phone: Number,
    applied: {
      type: Boolean,
      default: false,
    },
    applications: {
      type: Number,
      default: 0,
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
