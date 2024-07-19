const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    studentNum: Number,
    studentName: String,
    residenceOne: String,
    residenceTwo: String,
    status: {
      type: String,
      default: "Submitted",
    },
    average: Number,
    documentPath: String,
    createdAt: {
      type: Date,
      default: new Date()
    }
  },
);

const Application = new mongoose.model("Application", ApplicationSchema);

module.exports = Application;
