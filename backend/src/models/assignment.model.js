  import mongoose from "mongoose";

  const assignmentSchema = new mongoose.Schema(
    {
      class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
      },

      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
      },

      subject: {
        type: String,
        required: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        trim: true,
      },

      dueDate: {
        type: Date,
        required: true,
      },

      completedStudents: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
      ],
    },
    { timestamps: true }
  );

  // Optional but recommended for faster queries
  assignmentSchema.index({ class: 1, teacher: 1 });

  export const Assignment = mongoose.model("Assignment", assignmentSchema);
