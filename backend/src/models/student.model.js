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

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true
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