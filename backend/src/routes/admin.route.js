import {Router} from "express"
import {bulkCreateClasses, resetUserPassword, bulkRegisterUsers, getAllStudents, getAllParents, getAllTeachers , getAllClasses, assignStudentsToClass, assignClassTeacher, removeClassTeacher, assignTeacherClasses, createExam, getAllExam, getAllBusHandler, createDriver, getDrivers, createRoute, getAllRoutes, getRouteById, updateRoute, deleteRoute, createBus, getAllBuses, getBusById, updateBus, deleteBus, getTransportRequests, updateTransportRequestStatus } from "../controllers/admin.controller.js"

const router = Router()

router.post("/bulk-register", bulkRegisterUsers)
router.post("/reset-password/:userId", resetUserPassword)

router.get("/students", getAllStudents);
router.get("/parents", getAllParents)
router.get("/teachers", getAllTeachers)
router.post("/create-class", bulkCreateClasses)
router.get("/class-info", getAllClasses)
router.put("/assign-class-students", assignStudentsToClass)
router.put("/assign-class-teacher", assignClassTeacher)
router.post("/remove-class-teacher", removeClassTeacher)
router.put("/assign-teacher-classes", assignTeacherClasses)
router.post("/create-exam", createExam)
router.get("/get-all-exams", getAllExam)

router.get("/bus-handlers", getAllBusHandler)
router.post("/transport/create-driver", createDriver)
router.get("/transport/drivers", getDrivers)

router.post("/transport/create-route", createRoute)
router.get("/transport/routes", getAllRoutes)
router.get("/transport/single-route/:routeId", getRouteById)
router.put("/transport/update-route/:routeId", updateRoute)
router.delete("/transport/delete-route/:routeId", deleteRoute)
router.get("/transport/requests", getTransportRequests)
router.post("/transport/request/:requestId", updateTransportRequestStatus)


router.post("/transport/create-bus", createBus)
router.get("/transport/buses", getAllBuses)
router.get("/transport/single-bus/:busId", getBusById)
router.put("/transport/update-bus/:busId", updateBus)
router.delete("/transport/delete-bus/:busId", deleteBus)


export default router