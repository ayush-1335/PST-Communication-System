import {Router} from "express"
import { loginUser, registerUser, logoutUser, getUserDetails } from "../controllers/user.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post( loginUser)
router.route("/logout").post(authMiddleware, logoutUser)
router.route("/me").get(authMiddleware, getUserDetails)

export default router