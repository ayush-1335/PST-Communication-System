import { User } from "../models/user.model.js"
import { Student } from "../models/student.model.js";
import { Assignment } from "../models/assignment.model.js";
import { Attendance } from "../models/attendance.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Exam } from "../models/exam.model.js"
import { Material } from "../models/material.model.js"
import { Route } from "../models/Transport_Models/route.model.js";
import { StudentTransport } from "../models/Transport_Models/studentTransport.model.js";

const viewAttendance = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 1️⃣ Get student document
    const studentDoc = await Student.findOne({ user: userId });

    if (!studentDoc) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Student not found", false));
    }

    const studentId = studentDoc._id;

    // 2️⃣ Find attendance where this student exists
    const attendanceDocs = await Attendance.find({
      "records.student": studentId,
    })
      .populate("class", "standard section")
      .sort({ date: -1 });

    // 3️⃣ Extract only this student's record per attendance document
    const attendanceData = attendanceDocs.map((doc) => {
      const record = doc.records.find(
        (r) => r.student.toString() === studentId.toString()
      );

      return {
        attendanceId: doc._id,
        className: doc.class
          ? `${doc.class.standard}-${doc.class.section}`
          : null,
        date: doc.date,
        status: record?.status || "NOT_MARKED",
        academicYear: doc.academicYear,
      };
    });

    // 4️⃣ Calculate summary
    let present = 0;
    let absent = 0;
    let leave = 0;

    attendanceData.forEach((item) => {
      if (item.status === "PRESENT") present++;
      else if (item.status === "ABSENT") absent++;
      else if (item.status === "LEAVE") leave++;
    });

    const total = attendanceData.length;

    const percentage =
      total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    // 5️⃣ Return response
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          summary: {
            totalDays: total,
            present,
            absent,
            leave,
            percentage,
          },
          records: attendanceData,
        },
        "Attendance fetched successfully"
      )
    );
  } catch (error) {
    console.log("View Attendance Error:", error);
    return res.status(500).json(
      new ApiResponse(
        500,
        null,
        "Server error while fetching attendance",
        false
      )
    );
  }
};

const getStudentAssignments = async (req, res) => {
  try {
    const userId = req.user.userId;

    const student = await Student.findOne({ user: userId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const assignments = await Assignment.find({
      class: student.class,
    })
      .select("title subject dueDate completedStudents")
      .sort({ createdAt: -1 })
      .lean();

    const now = new Date();

    const formattedAssignments = assignments.map((assignment) => {
      const isCompleted = assignment.completedStudents
        .map(id => id.toString())
        .includes(student._id.toString());

      let status = "pending";

      if (isCompleted) status = "completed";
      else if (assignment.dueDate < now) status = "overdue";

      return {
        _id: assignment._id,
        title: assignment.title,
        subject: assignment.subject,
        dueDate: assignment.dueDate,
        status,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedAssignments,
    });

  } catch (error) {
    console.error("Student assignment error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getStudentExams = async (req, res) => {
  try {

    const userId = req.user.userId

    const studentDoc = await Student.findOne({ user: userId })
      .select("standard")
      .lean()

    if (!studentDoc) {
      return res.status(404).json(
        new ApiResponse(404, null, "Student not found", false)
      )
    }

    const exams = await Exam.find({ standard: studentDoc.standard })
      .sort({ examDate: 1 }).lean()

    return res.status(200).json(
      new ApiResponse(200, exams, "All exams fetch for student")
    )

  } catch (error) {
    console.log("Error in fetching exam for student: ", error)
    return res.status(500).json(
      new ApiResponse(500, null, "Server error in fetchingexam for student", false)
    )
  }

}

const getMaterialsForStudent = async (req, res) => {

  try {

    const userId = req.user.userId

    const student = await Student.findOne({ user: userId })

    if (!student) {
      return res.status(404).json(
        new ApiResponse(404, null, "Student not found", false)
      )
    }

    const materials = await Material.find({ standard: student.standard }).sort({ createdAt: -1 })

    return res.status(200).json(
      new ApiResponse(200, materials, "Materials fetch successfully")
    )


  } catch (error) {
    console.log("Error in getMaterialForStudent:", error)
    return res.status(500).json(
      new ApiResponse(500, null, "Server error in getMaterialForStudent", false)
    )
  }

}

const getAllRoutes = async (req, res) => {

  try {

    const routes = await Route.find().sort({ createdAt: -1 })

    return res.status(200).json(
      new ApiResponse(200, routes, "All routed fetch successfully")
    )

  } catch (error) {
    console.log("Server error in getAllRoutes")
    return res.status(500).json(
      new ApiResponse(500, null, "Server error in finding all routes", false)
    )

  }
}

const getStopsByRoute = async (req, res) => {
  try {
    const { routeId } = req.params;

    if (!routeId) {
      return res.status(400).json(
        new ApiResponse(400, null, "Route ID is required", false)
      );
    }

    const route = await Route.findById(routeId).select("routeName stops");

    if (!route) {
      return res.status(404).json(
        new ApiResponse(404, null, "Route not found", false)
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        route.stops,
        "Stops fetched successfully",
        true
      )
    );

  } catch (error) {
    console.log("Get Stops Error:", error);

    return res.status(500).json(
      new ApiResponse(500, null, "Something went wrong", false)
    );
  }
};

const applyTransportRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { routeId, stopName } = req.body;

    if (!routeId || !stopName) {
      return res.status(400).json(
        new ApiResponse(400, null, "Route and stop are required", false)
      );
    }

    const student = await Student.findOne({ user: userId });

    if (!student) {
      return res.status(404).json(
        new ApiResponse(404, null, "Student not found", false)
      );
    }

    const existing = await StudentTransport.findOne({
      student: student._id,
      status: { $in: ["PENDING", "APPROVED", "ACTIVE"] }
    });

    if (existing) {
      return res.status(400).json(
        new ApiResponse(400, null, "Transport already applied", false)
      );
    }

    const route = await Route.findById(routeId);

    if (!route) {
      return res.status(404).json(
        new ApiResponse(404, null, "Route not found", false)
      );
    }

    const selectedStop = route.stops.find(
      (stop) => stop.stopName === stopName
    );

    if (!selectedStop) {
      return res.status(400).json(
        new ApiResponse(400, null, "Invalid stop selected", false)
      );
    }

    const transportRequest = await StudentTransport.create({
      student: student._id,
      route: route._id,
      stop: {
        stopName: selectedStop.stopName,
        latitude: selectedStop.latitude,
        longitude: selectedStop.longitude
      },
      status: "PENDING"
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        transportRequest,
        "Transport request submitted successfully",
        true
      )
    );

  } catch (error) {
    console.log("Apply Transport Error:", error);

    return res.status(500).json(
      new ApiResponse(500, null, "Something went wrong", false)
    );
  }
};

const getRequestStatus = async (req, res) => {
  try {

    const student = await Student.findOne({ user: req.user.userId })

    if (!student) {
      return res.status(404).json(
        new ApiResponse(404, null, "Student not found", false)
      );
    }

    const studentId = student._id;

    const request = await StudentTransport.findOne({ student: studentId })
      .populate("route", "routeName")
      .populate("bus", "busNumber")
      .sort({ createdAt: -1 });

    if (!request) {
      return res.status(200).json(
        new ApiResponse(200, null, "No transport request found", true)
      );
    }

    if (
      request.status === "APPROVED" &&
      request.expiresAt &&
      new Date() > request.expiresAt
    ) {
      request.status = "EXPIRED";
      await request.save();
    }

    const responseData = {
      _id: request._id,
      status: request.status,
      routeName: request.route?.routeName || null,
      stopName: request.stopName,
      busNumber: request.bus?.busNumber || null,
      expiresAt: request.expiresAt
    };

    return res.status(200).json(
      new ApiResponse(200, responseData, "Request status fetched", true)
    );

  } catch (error) {

    console.log("Get Request Status Error:", error);

    return res.status(500).json(
      new ApiResponse(500, null, "Something went wrong", false)
    );
  }
};

const payTransportFee = async (req, res) => {
  try {

    const student = await Student.findOne({ user: req.user.userId });

    if (!student) {
      return res.status(404).json(
        new ApiResponse(404, null, "Student not found", false)
      );
    }

    const studentId = student._id;

    const request = await StudentTransport.findOne({
      student: studentId,
      status: "APPROVED"
    });

    if (!request) {
      return res.status(404).json(
        new ApiResponse(404, null, "No approved request found", false)
      );
    }

    if (request.expiresAt && new Date() > request.expiresAt) {

      request.status = "EXPIRED";
      await request.save();

      return res.status(400).json(
        new ApiResponse(400, null, "Request expired. Please apply again.", false)
      );
    }

    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 sec delay

    const isSuccess = Math.random() > 0.2; // 80% success

    if (!isSuccess) {
      return res.status(400).json(
        new ApiResponse(400, null, "Payment failed. Try again.", false)
      );
    }

    // 🔴 SUCCESS
    request.status = "ACTIVE";
    await request.save();

    return res.status(200).json(
      new ApiResponse(200, request, "Payment successful", true)
    );

  } catch (error) {
    console.log("Payment Error:", error);

    return res.status(500).json(
      new ApiResponse(500, null, "Payment failed", false)
    );
  }
};

export {
  viewAttendance,
  getStudentAssignments,
  getStudentExams,
  getMaterialsForStudent,
  getAllRoutes,
  getStopsByRoute,
  applyTransportRequest,
  getRequestStatus,
  payTransportFee,
};
