import {Router} from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { assignSection, bulkRegisterUsers } from "../controllers/admin.controller.js"

const router = Router()

router.post("/bulk-register", authMiddleware, bulkRegisterUsers)
router.put("/assign-sections", authMiddleware, assignSection)

export default router