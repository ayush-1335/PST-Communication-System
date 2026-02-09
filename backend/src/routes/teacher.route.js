import {Router} from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { getMyStudents, getMyClasses } from "../controllers/teacher.controller.js"

const router = Router()

router.get("/my-students", authMiddleware, getMyStudents)
router.get("/my-classes", authMiddleware, getMyClasses)

export default router