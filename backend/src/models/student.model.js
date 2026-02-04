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
      unique: true,
      sparse: true
    },

    standard: {
      type: String,
      enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
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