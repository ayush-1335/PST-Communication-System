import {Router} from "express"
import { loginUser, registerUser, logoutUser, getUserProfile, getAllStudents, getAllParents, getAllTeachers } from "../controllers/user.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"
import adminRouter from "./admin.route.js"
import parentRouter from "./parent.route.js"
import teacherRouter from "./teacher.route.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post( loginUser)
router.route("/logout").post(authMiddleware, logoutUser)
router.route("/profile").get(authMiddleware, getUserProfile)
router.route("/students").get(authMiddleware, getAllStudents)
router.route("/parents").get(authMiddleware, getAllParents)
router.route("/teachers").get(authMiddleware, getAllTeachers)

router.use("/admin", adminRouter)
router.use("/parent", parentRouter)
router.use("/teacher", teacherRouter)

export default router