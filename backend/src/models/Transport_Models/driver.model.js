import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },

  // username: {
  //   type: String,
  //   required: true,
  //   unique: true
  // },

  phone: {
    type: String,
    required: true
  },

  licenseNumber: {
    type: String,
    required: true,
    unique: true
  }

}, { timestamps: true });

export const Driver = mongoose.model("Driver", driverSchema);