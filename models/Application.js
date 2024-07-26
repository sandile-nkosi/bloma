const mongoose = require("mongoose");

const residenceStatus = ["Submitted", "In Progress", "Declined", "Accepted"];
const residenceOneStatusDefault = "Submitted";

const ApplicationSchema = new mongoose.Schema(
  {
    studentNum: Number,
    studentName: String,
    residenceOne: {
      type: mongoose.Types.ObjectId,
      ref: 'Residence'
    },
    residenceTwo: {
      type: mongoose.Types.ObjectId,
      ref: 'Residence'
    },
    residenceThree: {
      type: mongoose.Types.ObjectId,
      ref: 'Residence'
    },
    residenceOneStatus: {
      type: String,
      enum: residenceStatus,
      default: residenceOneStatusDefault,
    },
    residenceTwoStatus: {
      type: String,
      enum: residenceStatus,
      default: residenceOneStatusDefault,
    },
    residenceThreeStatus: {
      type: String,
      enum: residenceStatus,
      default: residenceOneStatusDefault,
    },
    average: Number,
    documentPath: String,
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'Student'
    },
  },
  {
    timestamps: true
  });

const Application = new mongoose.model("Application", ApplicationSchema);

module.exports = Application;
