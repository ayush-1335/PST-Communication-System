import {Router} from "express"
import { loginUser, registerUser, logoutUser, getUserProfile } from "../controllers/user.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"
import isAdmin from "../middleware/isAdmin.middleware.js"
import isParent from "../middleware/isParent.middleware.js"
import isTeacher from "../middleware/isTeacher.middleware.js"
import adminRouter from "./admin.route.js"
import parentRouter from "./parent.route.js"
import teacherRouter from "./teacher.route.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(authMiddleware, logoutUser)
router.route("/profile").get(authMiddleware, getUserProfile)

router.use("/admin", authMiddleware, isAdmin, adminRouter)
router.use("/parent", authMiddleware, isParent, parentRouter)
router.use("/teacher", authMiddleware, isTeacher, teacherRouter)

export default router