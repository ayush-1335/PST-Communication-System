import {Router} from "express"
import { viewAttendance, getStudentAssignments, getStudentExams, getMaterialsForStudent, applyTransportRequest, getAllRoutes, getStopsByRoute, getRequestStatus, payTransportFee } from "../controllers/student.controller.js"

const router = Router()

router.get("/view-attendance", viewAttendance)
router.get("/assignments", getStudentAssignments);
router.get("/exams", getStudentExams);
router.get("/materials", getMaterialsForStudent);
router.post("/transport/apply", applyTransportRequest)
router.get("/transport/routes", getAllRoutes)
router.get("/transport/:routeId/stops", getStopsByRoute)
router.get("/transport/request", getRequestStatus)
router.post("/transport/pay", payTransportFee)

export default router