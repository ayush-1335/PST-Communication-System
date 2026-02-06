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
    // required: true,
    // unique: true
  },

  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  }]

}, { timestamps: true })

classSchema.index({ standard: 1, section: 1 }, { unique: true })

export const Class = mongoose.model("Class", classSchema)
