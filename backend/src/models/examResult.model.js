import mongoose from "mongoose";

const examResultSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true
    },

    marksObtained: {
      type: Number,
      required: true,
      min: 0
    },

    remarks: {
      type: String,
      trim: true,
      default: ""
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null
    }
  },
  {
    timestamps: true
  }
);

examResultSchema.index({ exam: 1, student: 1 }, { unique: true });

export const ExamResult = mongoose.model("ExamResult", examResultSchema);