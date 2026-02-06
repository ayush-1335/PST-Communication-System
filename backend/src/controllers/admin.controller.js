import { User } from "../models/user.model.js"
import { Student } from "../models/student.model.js"
import { Teacher } from "../models/teacher.model.js"
import { Parent } from "../models/parent.model.js"
import { Class } from "../models/class.model.js"
import generateStudentCode from "../utils/generateStudentCode.js"
import { ApiResponse } from "../utils/ApiResponse.js"

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



export { bulkRegisterUsers, bulkCreateClasses }