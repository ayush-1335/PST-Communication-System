import {Router} from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { connectParentToStudent } from "../controllers/parent.controller.js"

const router = Router()

router.post("/parent-student", authMiddleware, connectParentToStudent)

export default router