import mongoose, { Schema } from "mongoose"

const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    subject: {
      type: String,
      required: true
    },

    standards: [
      {
        standard: String,
        section: String
      }
    ],

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
      }
    ]
  },
  { timestamps: true }
);

export const Teacher = mongoose.model("Teacher", teacherSchema);
