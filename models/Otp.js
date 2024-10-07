const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  otp: String,
  studentEmail: {
    type: String,
    unique: true
  },
  createdAt: Date,
  expiresAt: Date,
});

const Otp = new mongoose.model("Otp", otpSchema);

module.exports = Otp;
