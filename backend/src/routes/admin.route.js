import {Router} from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import {bulkCreateClasses, bulkRegisterUsers, getAllClasses, assignStudentsToClass, assignClassTeacher, removeClassTeacher, assignTeacherClasses } from "../controllers/admin.controller.js"

const router = Router()

router.post("/bulk-register", authMiddleware, bulkRegisterUsers)
router.post("/create-class", authMiddleware, bulkCreateClasses)
router.get("/class-info", authMiddleware, getAllClasses)
router.put("/assign-class-students", authMiddleware, assignStudentsToClass)
router.put("/assign-class-teacher", authMiddleware, assignClassTeacher)
router.post("/remove-class-teacher", authMiddleware, removeClassTeacher)
router.put("/assign-teacher-classes", authMiddleware, assignTeacherClasses)

export default router