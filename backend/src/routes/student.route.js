import {Router} from "express"
import { viewAttendance, getStudentAssignments } from "../controllers/student.controller.js"

const router = Router()

router.get("/view-attendance", viewAttendance)
router.get("/assignments", getStudentAssignments);

export default router