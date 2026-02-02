import {Router} from "express"
import { loginUser, registerUser, logoutUser, getUserProfile } from "../controllers/user.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"
import parentRouter from "./parent.route.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post( loginUser)
router.route("/logout").post(authMiddleware, logoutUser)
router.route("/profile").get(authMiddleware, getUserProfile)

router.use("/parent", parentRouter)

export default router