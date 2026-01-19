import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    rollNumber: {
      type: String,
      required: true,
      unique: true
    },

    standard: {
      type: String,
      required: true
    },

    section: {
        type: String
    },

    studentCode: {
      type: String,
      required: true,
      unique: true
    },

    address: {
      houseNo: String,
      street: String,
      city: String,
      state: String,
      pincode: String
    },

    parents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parent"
      }
    ]
  },
  { timestamps: true }
);


export const Student = mongoose.model("Student", studentSchema)