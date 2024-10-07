const mongoose = require("mongoose");

const residenceStatus = ["Submitted", "Rejected", "Conditionally Accepted", "Accepted", "Completed"];
const residenceOneStatusDefault = "Submitted";
const residences = ["Lost City 2", "Ngaka Modiri Molema", "Dr Nelson Mandela 1", "Biko House", "Sol Plaatje", "Dr James Moroka", "Kgosi Dick Montshioa", "Dr Nelson Mandela 2", "Sedibeng", "Hopeville", "Khayalethu", "Mbada", "Lost City 1", "Khayelitsha"];
const typeOfStudy = ["Undergraduate degree/diploma", "Honours degree/Postgraduate diploma", "Postgraduate Certificate(PGCE)", "Masters degree", "PhD degree"]; 
const disabilityDefault = "None";
const applicationStatus = ["New", "Renewal"]

const ApplicationSchema = new mongoose.Schema(
  {
    studentNum: {
      type: Number,
      unique: true
    },
    studentName: String,
    academicYear: Number,
    applicationYear: Number,
    comments: {
      type: String
    },
    typeOfStudy: {
      type: String,
      enum: typeOfStudy,
    },
    applicationStatus: {
      type: String,
      enum: applicationStatus,
    },
    disability: {
      type: Boolean,
      default: false
    },
    disabilityDetails: {
      type: String,
      default: disabilityDefault
    },
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
