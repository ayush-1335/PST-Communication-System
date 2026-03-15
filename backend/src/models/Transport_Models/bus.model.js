import mongoose from "mongoose";

const busSchema = new mongoose.Schema({

  busNumber: {
    type: String,
    required: true,
    unique: true
  },

  capacity: Number,

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
    latitude: Number,
    longitude: Number,
    updatedAt: Date
  }

}, { timestamps: true });

export const Bus = mongoose.model("Bus", busSchema);