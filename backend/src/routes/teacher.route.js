import {Router} from "express"
import { getMyStudents, getMyClasses, getAttendanceByDate, markAttendance } from "../controllers/teacher.controller.js"

const router = Router()

router.get("/my-students", getMyStudents)
router.get("/my-classes", getMyClasses)
router.get("/attendance", getAttendanceByDate);
router.post("/attendance/mark", markAttendance)

export default router