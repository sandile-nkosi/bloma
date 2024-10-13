const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  otp: String,
  studentEmail: {
    type: String,
    unique: true
  },
  createdAt: Date,
  expireAt: Date,
});

const Otp = new mongoose.model("Otp", otpSchema);

module.exports = Otp;
