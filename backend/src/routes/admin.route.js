import {Router} from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { bulkCreateClasses, bulkRegisterUsers } from "../controllers/admin.controller.js"

const router = Router()

router.post("/bulk-register", authMiddleware, bulkRegisterUsers)
router.post("/create-class", authMiddleware, bulkCreateClasses)

export default router