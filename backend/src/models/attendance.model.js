import mongoose from "mongoose";

const attendanceRecordSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    status: {
      type: String,
      enum: ["PRESENT", "ABSENT", "LEAVE"],
      default: "PRESENT",
    },
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    records: {
      type: [attendanceRecordSchema],
      required: true,
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    markedAt: {
      type: Date,
      default: Date.now,
    },

    lastEditedAt: {
      type: Date,
    },

    presentCount: { type: Number, default: 0 },
    absentCount: { type: Number, default: 0 },
    leaveCount: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },

    academicYear: {
      type: String,
      required: true, // e.g. "2024-2025"
    },
  },
  {
    timestamps: true,
  }
);

/* 🚨 Prevent duplicate attendance */
attendanceSchema.index(
  { class: 1, date: 1, academicYear: 1 },
  { unique: true }
);

attendanceSchema.index({ class: 1, academicYear: 1 });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
