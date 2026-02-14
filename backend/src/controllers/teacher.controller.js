import { Teacher } from "../models/teacher.model.js";
import { Class } from "../models/class.model.js";
import { Student } from "../models/student.model.js"
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
          classId: classDoc._id,
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

const getAttendanceByDate = async (req, res) => {
  try {
    const { date, academicYear } = req.query;

    if (!date || !academicYear) {
      return res.status(400).json(
        new ApiResponse(400, null, "Date and academicYear are required", false)
      );
    }

    // 🔹 Get logged-in teacher
    const teacherDoc = await Teacher.findOne({ user: req.user.userId });

    if (!teacherDoc) {
      return res.status(403).json(
        new ApiResponse(403, null, "Teacher not found", false)
      );
    }

    // 🔹 Get class where teacher is class teacher (1:1 relation)
    const classDoc = await Class.findOne({ classTeacher: teacherDoc._id });

    if (!classDoc) {
      return res.status(404).json(
        new ApiResponse(404, null, "Class not assigned to teacher", false)
      );
    }

    // 🔹 Normalize selected date (important!)
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    // 🔹 Find attendance
    const attendance = await Attendance.findOne({
      class: classDoc._id,
      date: selectedDate,
      academicYear,
    })
      .populate({
        path: "records.student",
        select: "rollNumber",
        populate: {
          path: "user",
          select: "name",
        },
      });

    if (!attendance) {
      return res.status(200).json(
        new ApiResponse(200, null, "No attendance found for this date")
      );
    }

    // 🔹 Check edit window (5 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays =
      (today - selectedDate) / (1000 * 60 * 60 * 24);

    const isEditable = diffDays <= 5;

    const responseData = {
      ...attendance.toObject(),
      isEditable,
    };

    return res.status(200).json(
      new ApiResponse(200, responseData, "Attendance fetched successfully")
    );

  } catch (error) {
    console.error("Get Attendance Error:", error);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
};

const markAttendance = async (req, res) => {
  try {
    const { classId, date, records, academicYear } = req.body
    const userId = req.user.userId

    if (!classId || !date || !records || records.length === 0 || !academicYear) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Missing required fields", false));
    }

    //get teacherDoc
    const teacherDoc = await Teacher.findOne({ user: userId })
    if (!teacherDoc) {
      return res
        .status(403)
        .json(new ApiResponse(403, null, "Teacher not found", false));
    }
    const teacherId = teacherDoc._id;

    //get classDoc
    const classDoc = await Class.findById(classId)
    if (!classDoc) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Class not found", false))
    }

    //check class teacher
    if (classDoc.classTeacher?.toString() !== teacherId.toString()) {
      return res
        .status(403)
        .json(new ApiResponse(403, null, "Only class teacher can mark attendance", false));
    }

    const selectedDate = new Date(date)
    selectedDate.setHours(0, 0, 0, 0)

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //restrict for future date
    if (selectedDate > today) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Cannot mark attendance for future date", false));
    }

    //lock attendace after limited time
    const maxEditDays = 5;
    const diffDays = (today - selectedDate) / (1000 * 60 * 60 * 24);

    if (diffDays > maxEditDays) {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            null,
            `Attendance cannot be edited after ${maxEditDays} days`,
            false
          )
        );
    }


    //check students in class or not
    const classStudents = await Student.find({ class: classId }).select("_id");

    const validStudentIds = classStudents.map(s => s._id.toString());

    for (let record of records) {
      if (!validStudentIds.includes(record.student.toString())) {
        return res
          .status(400)
          .json(new ApiResponse(400, null, "Invalid student in attendance list", false));
      }
    }

    //calculate attendance
    let presentCount = 0;
    let absentCount = 0;
    let leaveCount = 0;

    records.forEach((record) => {
      if (record.status === "PRESENT") presentCount++;
      else if (record.status === "ABSENT") absentCount++;
      else if (record.status === "LEAVE") leaveCount++;
    });

    const totalStudents = records.length;

    //update attendance
    let attendance = await Attendance.findOne({
      class: classId,
      date: selectedDate,
      academicYear,
    });

    if (attendance) {
      attendance.records = records;
      attendance.presentCount = presentCount;
      attendance.absentCount = absentCount;
      attendance.leaveCount = leaveCount;
      attendance.totalStudents = totalStudents;
      attendance.lastEditedAt = new Date();

      await attendance.save();
    } else {
      attendance = await Attendance.create({
        class: classId,
        date: selectedDate,
        records,
        markedBy: teacherId,
        academicYear,
        presentCount,
        absentCount,
        leaveCount,
        totalStudents,
      });
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          id: attendance._id,
          classId: attendance.class,
          date: attendance.date,
          presentCount: attendance.presentCount,
          absentCount: attendance.absentCount,
          leaveCount: attendance.leaveCount,
          totalStudents: attendance.totalStudents,
        },
        "Attendance marked successfully"
      )
    );


  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Server error during Attendance", false));
  }
}

export { getMyStudents, getMyClasses, markAttendance, getAttendanceByDate }