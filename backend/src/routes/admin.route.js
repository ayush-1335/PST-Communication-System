import {Router} from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { assignStudentsToClass, bulkCreateClasses, bulkRegisterUsers, getAllClasses } from "../controllers/admin.controller.js"

const router = Router()

router.post("/bulk-register", authMiddleware, bulkRegisterUsers)
router.post("/create-class", authMiddleware, bulkCreateClasses)
router.get("/class-info", authMiddleware, getAllClasses)
router.put("/assign-class-students", authMiddleware, assignStudentsToClass)

export default router