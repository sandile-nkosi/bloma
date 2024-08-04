const mongoose = require("mongoose");

const residenceStatus = ["Submitted", "Rejected", "Conditionally Accepted", "Accepted", "Completed"];
const residenceOneStatusDefault = "Submitted";
const residences = ["Lost City 2", "Ngaka Modiri Molema", "Dr Nelson Mandela 1", "Biko House", "Sol Plaatje", "Dr James Moroka", "Kgosi Dick Montshioa", "Dr Nelson Mandela 2", "Sedibeng", "Hopeville", "Khayalethu", "Mbada", "Lost City 1", "Khayelitsha"];

const ApplicationSchema = new mongoose.Schema(
  {
    studentNum: Number,
    studentName: String,
    residenceOne: {
      type: String,
      enum: residences,
      ref: 'Residence'
    },
    residenceTwo: {
      type: String,
      enum: residences,
      ref: 'Residence'
    },
    residenceThree: {
      type: String,
      enum: residences,
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
