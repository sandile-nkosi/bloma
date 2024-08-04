const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    isAdmin: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = new mongoose.model("Admin", AdminSchema);

module.exports = Admin;
