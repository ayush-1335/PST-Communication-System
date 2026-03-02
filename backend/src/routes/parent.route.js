import {Router} from "express"
import { connectParentToStudent, getChildAttendance, getChildExam, getParentChildren } from "../controllers/parent.controller.js"

const router = Router()

router.post("/parent-student", connectParentToStudent)
router.get("/children", getParentChildren)
router.get("/student/:studentId/attendance", getChildAttendance)
router.get("/student/:studentId/exams", getChildExam)

export default router