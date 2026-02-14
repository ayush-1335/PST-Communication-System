import {Router} from "express"
import { viewAttendance } from "../controllers/student.controller.js"

const router = Router()

router.get("/view-attendance", viewAttendance)

export default router