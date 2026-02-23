import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    subject: {
      type: String,
      required: true
    },

    standard: {
      type: String,
      required: true
    },

    examDate: {
      type: Date,
      required: true
    },

    maxMarks: {
      type: Number,
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export const Exam = mongoose.model("Exam", examSchema);