import { Student } from "../models/student.model.js";
import { Attendance } from "../models/attendanceSchema.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

export { viewAttendance };
