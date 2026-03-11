import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  fileUrl: {
    type: String,
    required: true
  },

  fileType: {
    type: String
  },

  type: {
    type: String,
    enum: ["NOTE", "ASSIGNMENT", "ANSWER_SHEET", "QUESTION_PAPER", "WORKSHEET", "DIAGRAM", "OTHER"],
    default: "NOTE"
  }, 

  standard: {
    type: Number,
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
},
{ timestamps: true }
);

export const Material = mongoose.model("Material", materialSchema);