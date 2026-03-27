import mongoose from "mongoose";

const studentTransportSchema = new mongoose.Schema({

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    unique: true // 🔥 one transport per student
  },

  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true
  },

  stop: {
    stopName: {
      type: String,
      required: true
    },
    latitude: Number,
    longitude: Number
  },

  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    default: null // 🔥 assigned only after approval
  },

  status: {
    type: String,
    enum: [
      "PENDING",    // student applied
      "APPROVED",   // admin approved (seat reserved)
      "ACTIVE",     // payment done
      "REJECTED",    // admin rejected
      "EXPIRED"     // request expired
    ],
    default: "PENDING"
  },

  isPaid: {
    type: Boolean,
    default: false
  },

  approvedAt: Date, // 🔥 useful for expiry logic
  paymentAt: Date,
  expiresAt: Date

}, { timestamps: true });

export const StudentTransport = mongoose.model("StudentTransport", studentTransportSchema);