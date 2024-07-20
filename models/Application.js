const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    studentNum: Number,
    studentName: String,
    residenceOne: String,
    residenceTwo: String,
    status: {
      type: String,
      enum: ["Submitted", "In Progress", "Declined", "Accepted"],
      default: "Submitted",
    },
    average: Number,
    documentPath: String,
    createdAt: {
      type: Date,
      default: new Date()
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'Student'
    },
  },
);

const Application = new mongoose.model("Application", ApplicationSchema);

module.exports = Application;
