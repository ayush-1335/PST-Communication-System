import { User } from "../models/user.model.js"
import { Student } from "../models/student.model.js";
import { Assignment } from "../models/assignment.model.js";
import { Attendance } from "../models/attendance.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Exam } from "../models/exam.model.js"

const viewAttendance = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 1️⃣ Get student document
    const studentDoc = await Student.findOne({ user: userId });

    if (!studentDoc) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Student not found", false));
    }

    const studentId = studentDoc._id;

    // 2️⃣ Find attendance where this student exists
    const attendanceDocs = await Attendance.find({
      "records.student": studentId,
    })
      .populate("class", "standard section")
      .sort({ date: -1 });

    // 3️⃣ Extract only this student's record per attendance document
    const attendanceData = attendanceDocs.map((doc) => {
      const record = doc.records.find(
        (r) => r.student.toString() === studentId.toString()
      );

      return {
        attendanceId: doc._id,
        className: doc.class
          ? `${doc.class.standard}-${doc.class.section}`
          : null,
        date: doc.date,
        status: record?.status || "NOT_MARKED",
        academicYear: doc.academicYear,
      };
    });

    // 4️⃣ Calculate summary
    let present = 0;
    let absent = 0;
    let leave = 0;

    attendanceData.forEach((item) => {
      if (item.status === "PRESENT") present++;
      else if (item.status === "ABSENT") absent++;
      else if (item.status === "LEAVE") leave++;
    });

    const total = attendanceData.length;

    const percentage =
      total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    // 5️⃣ Return response
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          summary: {
            totalDays: total,
            present,
            absent,
            leave,
            percentage,
          },
          records: attendanceData,
        },
        "Attendance fetched successfully"
      )
    );
  } catch (error) {
    console.log("View Attendance Error:", error);
    return res.status(500).json(
      new ApiResponse(
        500,
        null,
        "Server error while fetching attendance",
        false
      )
    );
  }
};

const getStudentAssignments = async (req, res) => {
  try {
    const userId = req.user.userId;

    const student = await Student.findOne({ user: userId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const assignments = await Assignment.find({
      class: student.class,
    })
      .select("title subject dueDate completedStudents")
      .sort({ createdAt: -1 })
      .lean();

    const now = new Date();

    const formattedAssignments = assignments.map((assignment) => {
      const isCompleted = assignment.completedStudents
        .map(id => id.toString())
        .includes(student._id.toString());

      let status = "pending";

      if (isCompleted) status = "completed";
      else if (assignment.dueDate < now) status = "overdue";

      return {
        _id: assignment._id,
        title: assignment.title,
        subject: assignment.subject,
        dueDate: assignment.dueDate,
        status,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedAssignments,
    });

  } catch (error) {
    console.error("Student assignment error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getStudentExams = async (req, res) => {
  try {

    const userId = req.user.userId

    const studentDoc = await Student.findOne({ user: userId })
    .select("standard")
    .lean()

    if (!studentDoc) {
      return res.status(404).json(
        new ApiResponse(404, null, "Student not found", false)
      )
    }

    const exams = await Exam.find({ standard: studentDoc.standard })
    .sort({ examDate: 1 }).lean()

    return res.status(200).json(
      new ApiResponse(200, exams, "All exams fetch for student")
    )

  } catch (error) {
    console.log("Error in fetching exam for student: ", error)
    return res.status(500).json(
      new ApiResponse(500, null, "Server error in fetchingexam for student", false)
    )
  }

}

export {
  viewAttendance,
  getStudentAssignments,
  getStudentExams
};
