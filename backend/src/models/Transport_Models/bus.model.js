import mongoose from "mongoose";

const busSchema = new mongoose.Schema({

  busNumber: {
    type: String,
    required: true,
    unique: true
  },

  busRegistrationNumber: {
    type: String,
    required: true,
    unique: true
  },

  capacity: {
    type: Number,
    required: true
  },

  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver"
  },

  handler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route"
  },

  currentLocation: {
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
    updatedAt: {
      type: Date
    }
  }

}, { timestamps: true });

export const Bus = mongoose.model("Bus", busSchema);