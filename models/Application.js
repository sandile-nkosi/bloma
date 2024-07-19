const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    studentNum: String,
    studentName: String,
    residenceOne: String,
    residenceTwo: String,
    status: {
      type: String,
      enum: ["Submitted", "In Progress", "Admitted"],
      default: "Submitted",
    },
    average: String,
    documentPath: String,
    createdAt: {
      type: Date,
      default: new Date()
    }
  },
);

const Application = new mongoose.model("Application", ApplicationSchema);

module.exports = Application;
