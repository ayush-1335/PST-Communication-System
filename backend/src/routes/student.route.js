import {Router} from "express"
import { viewAttendance, getStudentAssignments, getStudentExams } from "../controllers/student.controller.js"

const router = Router()

router.get("/view-attendance", viewAttendance)
router.get("/assignments", getStudentAssignments);
router.get("/exams", getStudentExams);

export default router