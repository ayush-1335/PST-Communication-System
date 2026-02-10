import {Router} from "express"
import {bulkCreateClasses, bulkRegisterUsers, getAllStudents, getAllParents, getAllTeachers , getAllClasses, assignStudentsToClass, assignClassTeacher, removeClassTeacher, assignTeacherClasses } from "../controllers/admin.controller.js"

const router = Router()

router.post("/bulk-register", bulkRegisterUsers)

router.get("/students", getAllStudents);
router.get("/parents", getAllParents)
router.get("/teachers", getAllTeachers)
router.post("/create-class", bulkCreateClasses)
router.get("/class-info", getAllClasses)
router.put("/assign-class-students", assignStudentsToClass)
router.put("/assign-class-teacher", assignClassTeacher)
router.post("/remove-class-teacher", removeClassTeacher)
router.put("/assign-teacher-classes", assignTeacherClasses)

export default router