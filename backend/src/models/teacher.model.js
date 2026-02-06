import mongoose from "mongoose"

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

    classes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class"
    }]
  },
  { timestamps: true }
);

export const Teacher = mongoose.model("Teacher", teacherSchema);
