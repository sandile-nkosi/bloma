const mongoose = require("mongoose");

const ResidenceSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    rooms: Number,
    roomsType: String,
    gender: String,
    imagePath: String,
    acceptedApplications: {
      type: Number,
      default: 0
    }
  },
);

const Residence = new mongoose.model("Residence", ResidenceSchema);

module.exports = Residence;