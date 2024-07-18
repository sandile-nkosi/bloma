const mongoose = require("mongoose");

var today = new Date();

const ApplicationSchema = new mongoose.Schema(
  {
    studentNum: {
      type: Number,
    },
    studentName: {
      type: String,
    },
    residenceOne: {
      type: String
    },
    residenceTwo: {
      type: String
    },
    status: {
      type: String,
      enum: ["Submitted", "In Progress", "Admitted"],
      default: "Submitted",
    },
    average: {
      type: Number,
    },
    documentPath: {
      type: String
    },
    createdAt: {
      type: Date,
      default: today
    }
  },
);

const Application = new mongoose.model("Application", ApplicationSchema);

module.exports = Application;
