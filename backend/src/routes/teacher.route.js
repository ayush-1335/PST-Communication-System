import {Router} from "express"
import { getMyStudents, getMyClasses, getAttendanceByDate, markAttendance, createAssignment, getTeacherAssignments, getAssignmentStatus, markStudentComplete, getClassSubjectExams, getClassTeacherExams, uploadMaterial  } from "../controllers/teacher.controller.js"
import upload from "../utils/multer.js"

const router = Router()

router.get("/my-students", getMyStudents)
router.get("/my-classes", getMyClasses)
router.get("/attendance", getAttendanceByDate);
router.post("/attendance/mark", markAttendance)
router.post("/create-assignment", createAssignment)
router.get("/assignments", getTeacherAssignments)
router.get("/assignment/:assignmentId/status", getAssignmentStatus)
router.put("/assignment/:assignmentId/mark-complete", markStudentComplete ) 
router.get("/class/exams", getClassTeacherExams)
router.get("/class/:classId/exams", getClassSubjectExams)
router.post("/upload-material", upload.single("file"), uploadMaterial)

export default router