import { Teacher } from "../models/teacher.model.js";
import { Class } from "../models/class.model.js";
import { Student } from "../models/student.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { Attendance } from "../models/attendance.model.js";
import { Assignment } from "../models/assignment.model.js";
import { Exam } from "../models/exam.model.js";

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

const createAssignment = async (req, res) => {
  const { classId, title, description, dueDate } = req.body
  const userId = req.user.userId

  if (!classId || !title || !description || !dueDate) {
    return res.status(400).json(
      new ApiResponse(400, null, "Missing fields required")
    )
  }

  try {
    const teacherDoc = await Teacher.findOne({ user: userId })

    if (!teacherDoc) {
      return res.status(404).json(
        new ApiResponse(404, null, "Teacher not found", false)
      )
    }

    const classDoc = await Class.findById(classId)

    if (!classDoc) {
      return res.status(404).json(
        new ApiResponse(404, null, "Class not found", false)
      )
    }

    await Assignment.create({
      class: classId,
      teacher: teacherDoc._id,
      subject: teacherDoc.subject,
      title,
      description,
      dueDate
    })

    return res.status(201).json(
      new ApiResponse(201,
        {
          subject: teacherDoc.subject,
          title,
          description,
          dueDate
        },
        "Assignment created successfully"
      )
    )

  } catch (error) {
    console.log("Error during assignment : ", error)
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    )
  }


}

const getTeacherAssignments = async (req, res) => {
  try {
    const userId = req.user.userId

    const teacherDoc = await Teacher.findOne({ user: userId })
    const teacherId = teacherDoc._id

    const assignments = await Assignment.find({
      teacher: teacherId,
    })
      .select("title subject dueDate class")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error in getting assignments",
    });
  }
};

const getAssignmentStatus = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId)
      .select("title dueDate class completedStudents")
      .lean();

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const classData = await Class.findById(assignment.class)
      .populate({
        path: "students",
        populate: {
          path: "user",
          select: "firstName lastName username"
        }
      })
      .lean();

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Get all students of that class
    const allStudents = classData.students

    const completedIds = assignment.completedStudents.map(
      (student) => student._id.toString()
    );

    const completed = [];
    const pending = [];
    const overdue = [];

    const now = new Date();

    allStudents.forEach((student) => {
      if (completedIds.includes(student._id.toString())) {
        completed.push(student);
      } else {
        if (assignment.dueDate < now) {
          overdue.push(student);
        } else {
          pending.push(student);
        }
      }
    });

    res.status(200).json({
      assignmentTitle: assignment.title,
      totalStudents: allStudents.length,
      completedCount: completed.length,
      pendingCount: pending.length,
      overdueCount: overdue.length,
      completed,
      pending,
      overdue,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error in getting assignmen status" });
  }
}

const markStudentComplete = async (req, res) => {
  const { assignmentId } = req.params;
  const { studentId } = req.body;

  await Assignment.findByIdAndUpdate(
    assignmentId,
    {
      $addToSet: { completedStudents: studentId },
    }
  );

  res.json({ message: "Updated successfully" });
}

// const getTeacherExams = async (req, res) => {
//   try {
//     const userId = req.user.userId
  
//     const teacherDoc = await Teacher.findOne({ user: userId })
//     .populate("classes", "standard section")
//     .lean()
  
//     if(!teacherDoc){
//       return res.status(404).json(
//         new ApiResponse(404, null, "Teacher not found", false)
//       )
//     }

//     if (!teacherDoc.classes || teacherDoc.classes.length === 0) {
//       return res.status(200).json(
//         new ApiResponse(200, [], "No classes assigned to teacher")
//       );
//     }
  
//     const standards = [...new Set(teacherDoc.classes.map(cls => cls.standard))]

//     const exams = await Exam.find({
//       subject: teacherDoc.subject,
//       standard: { $in: standards }
//     })
//     .select("title subject examDate standard")
//     .sort({ examDate: 1 })
//     .lean()

//     return res.status(200).json(
//       new ApiResponse(200, exams, "All exams fetch for teacher")
//     )


//   } catch (error) {
//     console.log("Error in fetching exam for teacher: ", error)
//     return res.status(500).json(
//       new ApiResponse(500, null, "Server error in fetchingexam for teacher", false)
//     )
//   }
// }

const getClassSubjectExams = async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = req.user.userId;

    const teacherDoc = await Teacher.findOne({ user: userId })
      .select("subject")
      .lean();

    if (!teacherDoc) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const classDoc = await Class.findById(classId)
      .select("standard section")
      .lean();

    if (!classDoc) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    const exams = await Exam.find({
      standard: classDoc.standard,
      subject: teacherDoc.subject,
    })
      .sort({ examDate: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: exams,
      class: `${classDoc.standard}-${classDoc.section}`,
    });

  } catch (error) {
    console.log("Error fetching class exams:", error);
    res.status(500).json({
      message: "Server error while fetching exams",
    });
  }
};

const getClassTeacherExams = async (req, res) => {
  try {
    const userId = req.user.userId
  
    const teacherDoc = await Teacher.findOne({ user: userId })
  
    if(!teacherDoc){
      return res.status(404).json(
        new ApiResponse(404, null, "Teacher not found", false)
      )
    }

    const classDoc = await Class.findOne({ classTeacher: teacherDoc._id })

    if(!classDoc){
      return res.status(404).json(
        new ApiResponse(404, null, "Class not assigned to this teacher", false)
      )
    }

    const standard = classDoc.standard

    const exams = await Exam.find({ standard })
    .sort({ examDate: 1})
    .lean()

    return res.status(200).json(
      new ApiResponse(200, exams, "All exams for class teacher is fetched")
    )


  } catch (error) {
    console.log("Error in fetching exam for class teacher: ", error)
    return res.status(500).json(
      new ApiResponse(500, null, "Server error in fetchingexam for class teacher", false)
    )
  }

}

export { 
  getMyStudents, 
  getMyClasses, 
  markAttendance, 
  getAttendanceByDate, 
  createAssignment, 
  getTeacherAssignments, 
  getAssignmentStatus, 
  markStudentComplete,
  // getTeacherExams,
  getClassSubjectExams,
  getClassTeacherExams
}
