import { User } from "../models/user.model.js"
import { Student } from "../models/student.model.js"
import { Teacher } from "../models/teacher.model.js"
import { Parent } from "../models/parent.model.js"
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
                email,
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

            const exists = await User.findOne({
                $or: [{ username }]
            })

            // console.log("Exists ", exists)

            if (exists) {
                throw new Error("User already exists")
            }

            const user = await User.create({
                firstName,
                lastName,
                email,
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
                    address
                })
            }

            if (role === "TEACHER") {
                await Teacher.create({
                    user: user._id,
                    subject
                })
            }

            if (role === "PARENT") {
                await Parent.create({
                    user: user._id,
                    phone
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

const assignSection = async (req, res) => {
  try {
    const { students } = req.body;

    // 1️⃣ Basic validation
     if (!Array.isArray(students)) {
    return res.status(400).json({
      message: "Students must be an array",
    });
  }

  if (students.length === 0) {
    return res.status(200).json({
      message: "No changes to update",
      updatedCount: 0,
    });
  }

    // 2️⃣ Loop & update each student
    for (let i = 0; i < students.length; i++) {
      const { studentId, section } = students[i];

      // skip invalid entry
      if (!studentId || !section) continue;

      await Student.findByIdAndUpdate(
        studentId,
        { section },
        { new: true }
      );
    }

    // 3️⃣ Send success response
    return res.status(200).json({
      message: "Sections updated successfully",
    });

  } catch (error) {
    console.error("Assign section error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { bulkRegisterUsers, assignSection }