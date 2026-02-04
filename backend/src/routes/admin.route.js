import {Router} from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { bulkRegisterUsers } from "../controllers/admin.controller.js"

const router = Router()

router.post("/bulk-register", authMiddleware, bulkRegisterUsers)

export default router