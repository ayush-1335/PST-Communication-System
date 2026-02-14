import {Router} from "express"
import { connectParentToStudent } from "../controllers/parent.controller.js"

const router = Router()

router.post("/parent-student", connectParentToStudent)

export default router