import { Teacher } from "../models/teacher.model.js";
import { Class } from "../models/class.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Attendance } from "../models/attendanceSchema.model.js";

const getMyStudents = async (req, res) => {
  try {
    // 1️⃣ Get logged-in user id
    const userId = req.user.userId;

    // 2️⃣ Find teacher by user id
    const teacher = await Teacher.findOne({ user: userId });

    if (!teacher) {
      return res.status(404).json(
        new ApiResponse(404, null, "Teacher profile not found", false)
      );
    }

    // 3️⃣ Find class where teacher is classTeacher
    const classDoc = await Class.findOne({
      classTeacher: teacher._id,
    })
      .populate({
        path: "students",
        select: "standard rollNumber user",
        populate: {
          path: "user",
          select: "firstName lastName username",
        },
      });

    // 4️⃣ If teacher has no class
    if (!classDoc) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            class: null,
            students: [],
          },
          "No class assigned to this teacher"
        )
      );
    }

    // 5️⃣ Success response
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          class: `${classDoc.standard}-${classDoc.section}`,
          students: classDoc.students,
        },
        "Students fetched successfully"
      )
    );
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message, false)
    );
  }
}

const getMyClasses = async (req, res) => {
  const userId = req.user.userId
  // console.log(userId);


  const teacher = await Teacher.findOne({ user: userId })
    .populate({
      path: "classes",
      select: "_id standard section"
    });

  if (!teacher) {
    return res.status(404).json(
      new ApiResponse(404, null, "Teacher profile not found", false)
    );
  }

  const classes = teacher.classes

  return res.status(200).json(
    new ApiResponse(200, classes, "Classes fetched Successfully", true)
  )

}

const markAttendance = async (req, res) => {
  try {

    const { classId, date, records, academicYear } = req.body

    const teacherId = req.user.userId

    if (!classId || !date || !records || records.length === 0 || !academicYear) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Missing required fields", false));
    }

    const attendanceDate = new Date(date)
    attendanceDate.setHours(0, 0, 0, 0)

    let attendance = await Attendance.findOne({
      class: classId,
      date: attendanceDate,
      academicYear
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const maxEditDays = 3;

    if (attendance) {

      const diffDays = (today - attendance.date) / (1000 * 60 * 60 * 24)
      if (diffDays > maxEditDays) {
        attendance.isLocked = true
      }

      if (attendance.isLocked) {
        return res.status(403).json(
          new ApiResponse(403, null, `Attendance cannot be edited after ${maxEditDays} days`, false)
        )
      }

      attendance.records = records
      attendance.lastEditedAt = new Date()

    } else {

      attendance = await Attendance.create({
        class: classId,
        date: attendanceDate,
        records,
        markedBy: teacherId,
        academicYear,
      });

    }

    return res
      .status(200)
      .json(new ApiResponse(200, attendance, "Attendance marked successfully"));


  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Server error", false));
  }
}

export { getMyStudents, getMyClasses, markAttendance }