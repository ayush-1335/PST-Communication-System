import {Router} from "express"
import { viewAttendance, getStudentAssignments, getStudentExams, getMaterialsForStudent } from "../controllers/student.controller.js"

const router = Router()

router.get("/view-attendance", viewAttendance)
router.get("/assignments", getStudentAssignments);
router.get("/exams", getStudentExams);
router.get("/materials", getMaterialsForStudent);

export default router