import {Router} from "express"
import { getMyStudents, getMyClasses, getAttendanceByDate, markAttendance, createAssignment, getTeacherAssignments, getAssignmentStatus, markStudentComplete  } from "../controllers/teacher.controller.js"

const router = Router()

router.get("/my-students", getMyStudents)
router.get("/my-classes", getMyClasses)
router.get("/attendance", getAttendanceByDate);
router.post("/attendance/mark", markAttendance)
router.post("/create-assignment", createAssignment)
router.get("/assignments", getTeacherAssignments)
router.get("/assignment/:assignmentId/status", getAssignmentStatus)
router.put("/assignment/:assignmentId/mark-complete", markStudentComplete ) 

export default router