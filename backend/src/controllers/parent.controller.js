import { ApiResponse } from "../utils/ApiResponse.js"
import { Student } from "../models/student.model.js";
import { Parent } from "../models/parent.model.js";
import { Attendance } from "../models/attendance.model.js"
import { Exam } from "../models/exam.model.js"

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

const getParentChildren = async (req, res) => {
    try {

        const userId = req.user.userId

        // Find Parent
        const parentDoc = await Parent.findOne({ user: userId })
            .select("students")
            .populate({
                path: "students",
                select: "standard section studentCode",
                populate: [{
                    path: 'user',
                    select: "firstName lastName"
                },
                {
                    path: 'class',
                    select: "section"

                }
                ]

            })
            .lean()

        if (!parentDoc) {
            return res.status(404).json(
                new ApiResponse(404, null, "Parent not found", false)
            )
        }

        if (!parentDoc.students || parentDoc.students.length === 0) {
            return res.status(200).json(
                new ApiResponse(200, [], "No children linked yet")
            );
        }

        //Find all children of parents
        const children = parentDoc.students.map((student) => ({
            _id: student._id,
            firstName: student.user?.firstName,
            lastName: student.user?.lastName,
            standard: student.standard,
            section: student.class?.section,
            studentCode: student.studentCode
        }))

        return res.status(200).json(
            new ApiResponse(200, children, "Children fetched Successfully")
        )

    } catch (error) {
        console.log("Error in getParentChildren:", error)
        return res.status(500).json(
            new ApiResponse(500, null, "Server error in getParentChildren", false)
        )
    }
}

const getChildAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const userId = req.user.userId;

    // Find parent
    const parentDoc = await Parent.findOne({ user: userId }).lean();
    if (!parentDoc) {
        return res.status(404).json(
            new ApiResponse(404, null, "Parent not found", false)
        );
    }

    // Security check
    const isChild = parentDoc.students.some(
        (id) => id.toString() === studentId
    )
    if (!isChild) {
        return res.status(403).json(
            new ApiResponse(403, null, "Unauthorized access", false)
        );
    }

    const attendance = await Attendance.find({
        "records.student": studentId
    }).lean();
    
    const studentAttendance = attendance.map((record) => {
        const studentRecord = record.records.find(
            (r) => r.student.toString() === studentId
        );
        
        return {
            date: record.date,
            status: studentRecord.status
        };
    });
    
    return res.status(200).json(
        new ApiResponse(200, studentAttendance, "Attendance fetched")
    );
    
  } catch (error) {
    console.log("Error in getChildAttendance:", error);

    return res.status(500).json(
      new ApiResponse(500, null, "Server error in getChildAttendance", false)
    );
  }
};

const getChildExam = async (req, res) => {
    try {
        const { studentId } = req.params
        const student = await Student.findById(studentId).populate("class")

        if(!student){
            return res.status(404).json(
                new ApiResponse(404, null, "Student not found", false)
            )
        }

        const exams = await Exam.find({
            standard: student.class.standard
        }).sort({ examDate: 1})

        return res.status(200).json(
            new ApiResponse(200, exams, "Exam fetch successfully")
        )
        
    } catch (error) {
        console.log("Error in getChildExam:", error)
        return res.status(500).json(
            new ApiResponse(500, null, "Server error in getChildExam", false)
        )
    }
}

export {
    connectParentToStudent,
    getParentChildren,
    getChildAttendance,
    getChildExam
}