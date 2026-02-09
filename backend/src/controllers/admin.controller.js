import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import { Student } from "../models/student.model.js"
import { Teacher } from "../models/teacher.model.js"
import { Parent } from "../models/parent.model.js"
import { Class } from "../models/class.model.js"
import generateStudentCode from "../utils/generateStudentCode.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const bulkRegisterUsers = async (req, res) => {
  const { users } = req.body

  // console.log("Users", users)

  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json(
      new ApiResponse(400, null, "Users array is required")
    )
  }

  const createdUsers = []
  const failedUsers = []

  for (const userData of users) {
    try {
      const {
        firstName,
        lastName,
        username,
        password,
        role,
        standard,
        address,
        phone,
        subject
      } = userData


      if (!firstName || !lastName || !username || !password || !role) {
        throw new Error("Missing required fields")
      }

      const exists = await User.findOne({ username })

      // console.log("Exists ", exists)

      if (exists) {
        throw new Error("User already exists")
      }

      const user = await User.create({
        firstName,
        lastName,
        username,
        password,
        role
      })

      // Role-based documents
      if (role === "STUDENT") {
        const studentCode = await generateStudentCode()

        await Student.create({
          user: user._id,
          studentCode,
          standard,
          address,
          class: null
        })
      }

      if (role === "TEACHER") {
        await Teacher.create({
          user: user._id,
          subject,
          classes: []
        })
      }

      if (role === "PARENT") {
        if (!phone) {
          throw new Error("Phone number required for parent")
        }

        await Parent.create({
          user: user._id,
          phone,
          students: []
        })
      }

      createdUsers.push(user.username)

    } catch (error) {
      failedUsers.push({
        username: userData.username,
        reason: error.message
      })
    }
  }

  return res.status(201).json(
    new ApiResponse(201, {
      createdUsers,
      failedUsers
    }, "Bulk registration completed")
  )
}

const bulkCreateClasses = async (req, res) => {
  const { classes } = req.body

  // 1️⃣ Validation
  if (!Array.isArray(classes) || classes.length === 0) {
    return res.status(400).json(
      new ApiResponse(400, null, "Classes array is required")
    )
  }

  const createdClasses = []
  const skippedClasses = []

  for (const classData of classes) {
    try {
      const { standard, section } = classData

      if (!standard || !section) {
        throw new Error("Standard and section are required")
      }

      // 2️⃣ Check duplicate (standard + section)
      const exists = await Class.findOne({ standard, section })
      if (exists) {
        skippedClasses.push({
          standard,
          section,
          reason: "Already exists"
        })
        continue
      }

      // 3️⃣ Create class
      const newClass = await Class.create({
        standard,
        section
      })

      createdClasses.push({
        _id: newClass._id,
        standard,
        section
      })

    } catch (error) {
      skippedClasses.push({
        standard: classData.standard || "unknown",
        section: classData.section || "unknown",
        reason: error.message
      })
    }
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        createdCount: createdClasses.length,
        createdClasses,
        skippedCount: skippedClasses.length,
        skippedClasses
      },
      "Bulk class creation completed"
    )
  )
}

const getAllClasses = async (req, res) => {
  try {

    if (req.user.role !== "ADMIN") {
      return res.status(403).json(
        new ApiResponse(403, null, "Access denied", false)
      );
    }

    const classes = await Class.find()
      .select("standard section")
      .populate({
        path: "classTeacher",
        populate: {
          path: "user",
          select: "firstName lastName"
        }
      })
      .sort({ standard: 1, section: 1 });

    return res.status(200).json(
      new ApiResponse(200, classes, "Classes fetched successfully")
    );
  } catch (error) {
    console.error("Get classes error:", error);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
};

const assignStudentsToClass = async (req, res) => {
  const { classId, students } = req.body

  const session = await mongoose.startSession()
  session.startTransaction()

  // 1️⃣ Validation
  if (!classId) {
    throw new ApiResponse(400, null, "classId is required", false)
  }

  if (!Array.isArray(students) || students.length === 0) {
    throw new ApiResponse(400, null, "Students array is empty", false)
  }

  // 2️⃣ Find class
  const classDoc = await Class.findById(classId)
  if (!classDoc) {
    throw new ApiResponse(404, null, "Class not found", false)
  }

  // 3️⃣ Fetch students
  const studentDocs = await Student.find({
    _id: { $in: students }
  })

  if (studentDocs.length !== students.length) {
    throw new ApiResponse(400, null, "One or more students not found", false)
  }

  // 4️⃣ Standard validation (VERY IMPORTANT)
  const invalidStudents = studentDocs.filter(
    (student) => student.standard !== classDoc.standard
  )

  if (invalidStudents.length > 0) {
    throw new ApiResponse(
      400,
      null,
      `Some students do not belong to standard ${classDoc.standard}`,
      false
    )
  }

  // 5️⃣ Assign class in bulk
  await Student.updateMany(
    { _id: { $in: students } },
    { $set: { class: classId } },
    { session }
  )

  // 6️⃣ Update class → students (NO duplicates)
  await Class.findByIdAndUpdate(
    classId,
    { $addToSet: { students: { $each: students } } },
    { session }
  )

  await session.commitTransaction()
  session.endSession()


  // 6️⃣ Success response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        classId,
        assignedCount: students.length
      },
      "Students assigned to class successfully"
    )
  )
}

const assignClassTeacher = async (req, res) => {
  const { classId, teacherId } = req.body

  // 1️⃣ Validation
  if (!classId || !teacherId) {
    return res.status(400).json(
      new ApiResponse(400, null, "classId and teacherId are required")
    )
  }

  try {
    const classDoc = await Class.findById(classId)
    if (!classDoc) {
      return res.status(400).json(
        new ApiResponse(400, null, "Class not found", false)
      )
    }

    const teacherDoc = await Teacher.findById(teacherId)
      .populate({
        path: "user",
        select: "firstName lastName"
      })
    if (!teacherDoc) {
      return res.status(400).json(
        new ApiResponse(400, null, "Teacher not found", false)
      )
    }

    if (classDoc.classTeacher?.toString() === teacherId) {
      return res.status(200).json(
        new ApiResponse(
          200,
          null,
          "Teacher already assigned as class teacher"
        )
      )
    }

    const alreadyClassTeacher = await Class.findOne({
      classTeacher: teacherId
    });

    if (alreadyClassTeacher) {
      return res.status(400).json(
        new ApiResponse(
          400,
          {
            currentClass: `${alreadyClassTeacher.standard}-${alreadyClassTeacher.section}`
          },
          "Teacher is already assigned as class teacher to another class",
          false
        )
      );
    }

    classDoc.classTeacher = teacherId
    await classDoc.save()

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          class: `${classDoc.standard}-${classDoc.section}`,
          classTeacher: `${teacherDoc.user.firstName} ${teacherDoc.user.lastName}`
        },
        "Class teacher assigned successfully"
      )
    )

  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message, false)
    )
  }
}

const assignTeacherClasses = async (req, res) => {
  const { teacherId, classIds } = req.body

  try {

    const teacher = await Teacher.findById(teacherId)

    if (!teacher) {
      return res.status(404).json(
        new ApiResponse(500, null, "Teacher not found", false)
      )
    }

    const existingClasses = await Class.find({
      _id: { $in: classIds }
    }).select("_id");

    if (existingClasses.length !== classIds.length) {
      return res.status(404).json(
        new ApiResponse(
          404,
          null,
          "One or more classes do not exist",
          false
        )
      );
    }

    await Teacher.findByIdAndUpdate(
      teacherId,
      {
        $addToSet: {
          classes: { $each : classIds }
        }
      },
      { new: true }
    )

    const updatedTeacher = await Teacher.findById(teacherId)
    .populate({
      path: "user",
      select: "firstName lastName"
    })
    .populate({
      path: "classes",
      select: "standard section"
    })

    const { firstName, lastName } = updatedTeacher.user;

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            teacher: `${firstName} ${lastName}`,
            classes: updatedTeacher.classes
          }
        )
      )
    


  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message, false)
    );
  }

}

export { bulkRegisterUsers, getAllClasses, bulkCreateClasses, assignStudentsToClass, assignClassTeacher, assignTeacherClasses }