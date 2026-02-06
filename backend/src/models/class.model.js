import mongoose from "mongoose"

const classSchema = new mongoose.Schema({
  standard: {
    type: String,
    enum: ["1","2","3","4","5","6","7","8","9","10","11","12"],
    required: true
  },

  section: {
    type: String,
    required: true
  },

  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
    unique: true
  }

}, { timestamps: true })

export const Class = mongoose.model("Class", classSchema)
