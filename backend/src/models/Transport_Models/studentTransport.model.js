import mongoose from "mongoose";

const studentTransportSchema = new mongoose.Schema({

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true
  },

  stopName: {
    type: String,
    required: true
  }

}, { timestamps: true });

export const StudentTransport = mongoose.model("StudentTransport", studentTransportSchema);