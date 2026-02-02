import { Student } from "../models/student.model.js";
import { Parent } from "../models/parent.model.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const connectParentToStudent = async (req, res) => {
    const parentId = req.user.userId
    const { studentCode } = req.body

    // console.log(parentId)
    // console.log(studentCode)

    try {

        if (!studentCode) {
            return res.status(401)
                .json(
                    new ApiResponse(401, null, "Student Code required!", false)
                )
        }

        const student = await Student.findOne({ studentCode }).populate("user", "isActive")

        if (!student) {
            return res.status(401)
                .json(
                    new ApiResponse(401, null, "Student not exists or code is wrong", false)
                )
        }

        if (!student.user.isActive) {
            return res.status(403)
                .json(
                    new ApiResponse(403, null, "Student account is disabled", false)
                )
        }

        const parent = await Parent.findOne({ user: parentId }).populate("user", "isActive")

        if (!parent) {
            return res.status(401)
                .json(
                    new ApiResponse(401, null, "Parent not exists", false)
                )
        }

        if (!parent.user.isActive) {
            return res.status(403)
                .json(
                    new ApiResponse(403, null, "Parent account is disabled", false)
                )
        }

        // Check student already linked or not

        if (parent.students.some(id => id.equals(student._id))) {
            return res.status(409)
                .json(
                    new ApiResponse(409, null, "Student already linked!", false)
                )
        }

        // Link student and parent both side

        parent.students.push(student._id)
        student.parents.push(parent._id)

        await parent.save()
        await student.save()

        return res.status(200)
            .json(
                new ApiResponse(200, null, "Student Linked Successfully")
            )

    } catch (error) {
        console.error(error)
        return res.status(500).json(
            new ApiResponse(500, null, "Internal server error", false)
        )
    }

}

export { connectParentToStudent }