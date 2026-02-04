import { User } from "../models/user.model.js"
import { Student } from "../models/student.model.js"
import { Teacher } from "../models/teacher.model.js"
import { Parent } from "../models/parent.model.js"
import generateStudentCode from "../utils/generateStudentCode.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const bulkRegisterUsers = async (req, res) => {
    const { users } = req.body

    console.log(users)

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
                $or: [{ username }, { email }]
            })

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

export { bulkRegisterUsers }