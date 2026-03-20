import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import { Student } from "../models/student.model.js"
import { Teacher } from "../models/teacher.model.js"
import { Parent } from "../models/parent.model.js"
import { Class } from "../models/class.model.js"
import generateStudentCode from "../utils/generateStudentCode.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Exam } from "../models/exam.model.js"
import { generateTempPassword } from "../utils/generateTempPassword.js"
import { generateUsername } from "../utils/generateUsername.js"
import { TransportHandler } from "../models/transportHandler.model.js"
import { Driver } from "../models/Transport_Models/driver.model.js"
import { Route } from "../models/Transport_Models/route.model.js"
import { Bus } from "../models/Transport_Models/bus.model.js";


const bulkRegisterUsers = async (req, res) => {
  const { users } = req.body

  // console.log("Users", users)

  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json(
      new ApiResponse(400, null, "Users array is required")
    )
  }

  const createdUsers = []
  const failedUsers = []

  for (const userData of users) {
    try {
      const {
        firstName,
        lastName,
        role,
        standard,
        address,
        phone,
        subject
      } = userData


      if (!firstName || !lastName || !role) {
        throw new Error("Missing required fields")
      }

      const allowedRoles = ["STUDENT", "TEACHER", "PARENT", "TRANSPORT_HANDLER"]

      if (!allowedRoles.includes(role)) {
        throw new Error("Invalid role")
      }

      let username = await generateUsername(role)

      while (await User.findOne({ username })) {
        username = await generateUsername(role)
      }

      const tempPassword = generateTempPassword()

      const user = await User.create({
        firstName,
        lastName,
        username,
        password: tempPassword,
        role
      })

      // Role-based documents
      if (role === "STUDENT") {
        const studentCode = await generateStudentCode()

        await Student.create({
          user: user._id,
          studentCode,
          standard,
          address,
          class: null
        })
      }

      if (role === "TEACHER") {
        await Teacher.create({
          user: user._id,
          subject,
          classes: []
        })
      }

      if (role === "PARENT") {
        if (!phone) {
          throw new Error("Phone number required for parent")
        }

        await Parent.create({
          user: user._id,
          phone,
          students: []
        })
      }

      if (role === "TRANSPORT_HANDLER") {
        if (!phone) {
          throw new Error("Phone number required for parent")
        }

        await TransportHandler.create({
          user: user._id,
          phone,
        })
      }

      createdUsers.push({
        username,
        tempPassword,
        firstName,
        lastName,
        role
      })

    } catch (error) {
      failedUsers.push({
        name: `${userData.firstName} ${userData.lastName}`,
        reason: error.message
      })
    }
  }

  return res.status(201).json(
    new ApiResponse(201, {
      createdUsers,
      failedUsers
    }, "Bulk registration completed")
  )
}

const resetUserPassword = async (req, res) => {

  const { userId } = req.params

  const user = await User.findById(userId)

  if (!user) {
    return res.status(404).json(
      new ApiResponse(404, null, "User not found", false)
    )
  }

  const tempPassword = generateTempPassword()

  user.password = tempPassword
  await user.save()

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        username: user.username,
        tempPassword
      },
      "Password reset successfully"
    )
  )
}

const getAllStudents = async (req, res) => {

  // console.log("IN get all students")

  try {
    const students = await Student.find({})
      .select("standard section user _id")
      .populate({
        path: "user",
        select: "firstName lastName username _id",
      })
      .populate({
        path: "class",
        select: "standard section"
      })

    if (!students.length) {
      return res.status(404).json(
        new ApiResponse(404, [], "No students found")
      )
    }

    // console.log(students)

    return res.status(200).json(
      new ApiResponse(200, students, "Students fetched successfully")
    )
  } catch (error) {
    console.error("Error fetching students:", error)
    return res.status(500).json(
      new ApiResponse(500, null, "Internal server error", false)
    )
  }
}

const getAllParents = async (req, res) => {

  // console.log("IN get all parents")

  try {
    const parents = await Parent.find()
      .populate({
        path: "user",
        select: "-password"
      })

    if (!parents.length) {
      return res.status(404).json(
        new ApiResponse(404, [], "No parents found")
      )
    }

    // console.log(parents)

    return res.status(200).json(
      new ApiResponse(200, parents, "Parents fetched successfully")
    )
  } catch (error) {
    console.error("Error fetching parents:", error)
    return res.status(500).json(
      new ApiResponse(500, null, "Internal server error", false)
    )
  }
}

const getAllTeachers = async (req, res) => {

  try {
    const teachers = await Teacher.find()
      .populate({
        path: "user",
        select: "-password"
      })

    if (!teachers.length) {
      return res.status(404).json(
        new ApiResponse(404, [], "No teachers found")
      )
    }

    // console.log(teachers)

    return res.status(200).json(
      new ApiResponse(200, teachers, "Teachers fetched successfully")
    )
  } catch (error) {
    console.error("Error fetching teachers:", error)
    return res.status(500).json(
      new ApiResponse(500, null, "Internal server error", false)
    )
  }
}

const bulkCreateClasses = async (req, res) => {
  const { classes } = req.body

  // 1️⃣ Validation
  if (!Array.isArray(classes) || classes.length === 0) {
    return res.status(400).json(
      new ApiResponse(400, null, "Classes array is required")
    )
  }

  const createdClasses = []
  const skippedClasses = []

  for (const classData of classes) {
    try {
      const { standard, section } = classData

      if (!standard || !section) {
        throw new Error("Standard and section are required")
      }

      // 2️⃣ Check duplicate (standard + section)
      const exists = await Class.findOne({ standard, section })
      if (exists) {
        skippedClasses.push({
          standard,
          section,
          reason: "Already exists"
        })
        continue
      }

      // 3️⃣ Create class
      const newClass = await Class.create({
        standard,
        section
      })

      createdClasses.push({
        _id: newClass._id,
        standard,
        section
      })

    } catch (error) {
      skippedClasses.push({
        standard: classData.standard || "unknown",
        section: classData.section || "unknown",
        reason: error.message
      })
    }
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        createdCount: createdClasses.length,
        createdClasses,
        skippedCount: skippedClasses.length,
        skippedClasses
      },
      "Bulk class creation completed"
    )
  )
}

const getAllClasses = async (req, res) => {
  try {

    if (req.user.role !== "ADMIN") {
      return res.status(403).json(
        new ApiResponse(403, null, "Access denied", false)
      );
    }

    const classes = await Class.find()
      .select("standard section")
      .populate({
        path: "classTeacher",
        populate: {
          path: "user",
          select: "firstName lastName"
        }
      })
      .sort({ standard: 1, section: 1 });

    return res.status(200).json(
      new ApiResponse(200, classes, "Classes fetched successfully")
    );
  } catch (error) {
    console.error("Get classes error:", error);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
};

const assignStudentsToClass = async (req, res) => {
  const { classId, students } = req.body

  const session = await mongoose.startSession()
  session.startTransaction()

  // 1️⃣ Validation
  if (!classId) {
    throw new ApiResponse(400, null, "classId is required", false)
  }

  if (!Array.isArray(students) || students.length === 0) {
    throw new ApiResponse(400, null, "Students array is empty", false)
  }

  // 2️⃣ Find class
  const classDoc = await Class.findById(classId)
  if (!classDoc) {
    throw new ApiResponse(404, null, "Class not found", false)
  }

  // 3️⃣ Fetch students
  const studentDocs = await Student.find({
    _id: { $in: students }
  })

  if (studentDocs.length !== students.length) {
    throw new ApiResponse(400, null, "One or more students not found", false)
  }

  // 4️⃣ Standard validation (VERY IMPORTANT)
  const invalidStudents = studentDocs.filter(
    (student) => student.standard !== classDoc.standard
  )

  if (invalidStudents.length > 0) {
    throw new ApiResponse(
      400,
      null,
      `Some students do not belong to standard ${classDoc.standard}`,
      false
    )
  }

  // 5️⃣ Assign class in bulk
  await Student.updateMany(
    { _id: { $in: students } },
    { $set: { class: classId } },
    { session }
  )

  // 6️⃣ Update class → students (NO duplicates)
  await Class.findByIdAndUpdate(
    classId,
    { $addToSet: { students: { $each: students } } },
    { session }
  )

  await session.commitTransaction()
  session.endSession()


  // 6️⃣ Success response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        classId,
        assignedCount: students.length
      },
      "Students assigned to class successfully"
    )
  )
}

const assignClassTeacher = async (req, res) => {
  const { classId, teacherId } = req.body

  // 1️⃣ Validation
  if (!classId || !teacherId) {
    return res.status(400).json(
      new ApiResponse(400, null, "classId and teacherId are required")
    )
  }

  try {
    const classDoc = await Class.findById(classId)
    if (!classDoc) {
      return res.status(400).json(
        new ApiResponse(400, null, "Class not found", false)
      )
    }

    const teacherDoc = await Teacher.findById(teacherId)
      .populate({
        path: "user",
        select: "firstName lastName"
      })
    if (!teacherDoc) {
      return res.status(400).json(
        new ApiResponse(400, null, "Teacher not found", false)
      )
    }

    if (classDoc.classTeacher?.toString() === teacherId) {
      return res.status(200).json(
        new ApiResponse(
          200,
          null,
          "Teacher already assigned as class teacher"
        )
      )
    }

    const alreadyClassTeacher = await Class.findOne({
      classTeacher: teacherId
    });

    if (alreadyClassTeacher) {
      return res.status(400).json(
        new ApiResponse(
          400,
          {
            currentClass: `${alreadyClassTeacher.standard}-${alreadyClassTeacher.section}`
          },
          "Teacher is already assigned as class teacher to another class",
          false
        )
      );
    }

    classDoc.classTeacher = teacherId
    await classDoc.save()

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          class: `${classDoc.standard}-${classDoc.section}`,
          classTeacher: `${teacherDoc.user.firstName} ${teacherDoc.user.lastName}`
        },
        "Class teacher assigned successfully"
      )
    )

  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message, false)
    )
  }
}

const removeClassTeacher = async (req, res) => {
  const { classId } = req.body

  console.log(classId)

  if (!classId) {
    return res.status(400).json(
      new ApiResponse(400, null, "Class Id required", false)
    )
  }

  try {

    const classDoc = await Class.findById(classId)
      .select("standard section classTeacher")
      .populate({
        path: "classTeacher",
        select: "user",
        populate: {
          path: "user",
          select: "firstName lastName"
        }
      }
      )

    if (!classDoc) {
      return res.status(404).json(
        new ApiResponse(404, null, "Class not found", false)
      )
    }

    if (!classDoc.classTeacher) {
      return res.status(400).json(
        new ApiResponse(400, null, "No class teacher assigned", false)
      );
    }

    const { standard, section } = classDoc;
    const { firstName, lastName } = classDoc.classTeacher.user;

    classDoc.classTeacher = null;
    await classDoc.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          teacher: `${firstName} ${lastName}`,
          class: `${standard} - ${section}`
        },
        `Class Teacher ${firstName} ${lastName} removed from ${standard} - ${section}`
      )
    )

  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message, false)
    );
  }



}

const assignTeacherClasses = async (req, res) => {
  const { teacherId, classIds } = req.body

  if (!teacherId || !Array.isArray(classIds) || classIds.length === 0) {
    return res.status(400).json(
      new ApiResponse(
        400,
        null,
        "teacherId and classIds array are required",
        false
      )
    );
  }

  try {

    const teacher = await Teacher.findById(teacherId)
    if (!teacher) {
      return res.status(404).json(
        new ApiResponse(500, null, "Teacher not found", false)
      )
    }

    const existingClasses = await Class.find({
      _id: { $in: classIds }
    }).select("_id");
    if (existingClasses.length !== classIds.length) {
      return res.status(404).json(
        new ApiResponse(
          404,
          null,
          "One or more classes do not exist",
          false
        )
      );
    }

    teacher.classes = classIds
    await teacher.save()

    const updatedTeacher = await Teacher.findById(teacherId)
      .populate({
        path: "user",
        select: "firstName lastName"
      })
      .populate({
        path: "classes",
        select: "standard section"
      })

    const { firstName, lastName } = updatedTeacher.user;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          teacher: `${firstName} ${lastName}`,
          classes: updatedTeacher.classes
        },
        "Teacher assigned to classes sucessfully"
      )
    )



  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message, false)
    );
  }

}

const createExam = async (req, res) => {
  try {

    const { title, subject, standard, examDate, maxMarks } = req.body

    if (!title || !subject || !standard || !examDate || !maxMarks) {
      return res.status(400)
        .json(
          new ApiResponse(400, null, "All feilds are required!", false)
        )
    }

    const examDateObj = new Date(examDate)

    const existingExam = await Exam.findOne({
      standard,
      examDate: examDateObj
    })

    if (existingExam) {
      return res.status(401).json(
        new ApiResponse(401, null, "An exam is already scheduled for this standard on this date")
      )
    }

    const exam = await Exam.create({
      title,
      subject,
      standard,
      examDate: examDateObj,
      maxMarks
    })

    return res.status(200).json(
      new ApiResponse(200, exam, "Exam created successfully")
    )


  } catch (error) {
    console.log("Error while creating Exam: ", error)
    res.status(500).json(
      new ApiResponse(500, null, "Server error in Creating exam", false)
    );
  }
}

const getAllExam = async (req, res) => {
  try {
    const exams = await Exam.find()
      .select("-createdBy")
      .sort({ examDate: 1 })
      .lean()

    return res.status(200).json(
      new ApiResponse(200, exams, "All exams fetch successfully")
    )

  } catch (error) {
    console.log("Error in getAllExam: ", error)
    return res.status(500).json(
      new ApiResponse(500, null, "Server Error in getAllExam")
    )
  }
}

// Transport System

const getAllBusHandler = async (req, res) => {
  try {
    const busHandlers = await TransportHandler.find()
      .populate({
        path: "user",
        select: "-password"
      })

    if (!busHandlers.length) {
      return res.status(404).json(
        new ApiResponse(404, [], "No busHandlers found")
      )
    }

    // console.log(teachers)

    return res.status(200).json(
      new ApiResponse(200, busHandlers, "busHandlers fetched successfully")
    )
  } catch (error) {
    console.error("Error fetching busHandlers:", error)
    return res.status(500).json(
      new ApiResponse(500, null, "Internal server error", false)
    )
  }
}

const createDriver = async (req, res) => {
  try {

    const { firstName, lastName, phone, licenseNumber } = req.body

    if (!firstName || !lastName || !phone || !licenseNumber) {
      return res.status(400).json(
        new ApiResponse(400, null, "All feilds required", false)
      )
    }

    const driver = await Driver.create({
      firstName,
      lastName,
      phone,
      licenseNumber
    })

    res.status(201).json(
      new ApiResponse(201, driver, "Driver created successfully")
    )

  } catch (error) {
    console.log("Server error in createDriver")
    res.status(500).json(
      new ApiResponse(500, null, "Server error in creating driver", false)
    )
  }
}

const getDrivers = async (req, res) => {
  try {

    const drivers = await Driver.find()

    return res.status(200).json(
      new ApiResponse(200, drivers, "Drivers fetched successfully", true)
    )

  } catch (error) {
    console.log("Server error in getDrivers")
    return res.status(500).json(
      new ApiResponse(500, null, "Server error fetching drivers", false)
    )

  }
}

const createRoute = async (req, res) => {

  try {

    const { routeName, stops } = req.body

    if (!routeName || !stops || stops.length < 2) {
      return res.status(400).json(
        new ApiResponse(400, null, "Route name and at least 2 stops are required", false)
      )
    }

    const existingRoute = await Route.findOne({ routeName })

    if (existingRoute) {
      return res.status(400).json(
        new ApiResponse(400, null, "Route already exists", false)
      )
    }

    const newRoute = await Route.create({
      routeName,
      stops
    })

    return res.status(201).json(
      new ApiResponse(201, newRoute, "Route created successfully")
    )

  } catch (error) {

    console.log("Sevrer error in createRoute")
    return res.status(500).json(
      new ApiResponse(500, null, "Server error in creating routing", false)
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

const getRouteById = async (req, res) => {

  try {

    const { routeId } = req.params

    const route = await Route.findById(routeId)

    if (!route) {
      return res.status(404).json(
        new ApiResponse(404, null, "Route not found", false)
      )
    }

    return res.status(200).json(
      new ApiResponse(200, route, "Route By Id fetch fetch successfully")
    )

  } catch (error) {
    console.log("Server error in getRouteById")
    return res.status(500).json(
      new ApiResponse(500, null, "Server error in finding selected route", false)
    )

  }

}

const updateRoute = async (req, res) => {

  try {

    const { routeId } = req.params
    const { routeName, stops } = req.body

    const updatedRoute = await Route.findByIdAndUpdate(
      routeId,
      { routeName, stops },
      { new: true, runValidators: true }
    )

    if (!updatedRoute) {
      return res.status(404).json(
        new ApiResponse(404, null, "Route not found", false)
      )
    }

    return res.status(200).json(
      new ApiResponse(200, updatedRoute, "Route Updated successfully")
    )

  } catch (error) {
    console.log("Server route in updateRoute")
    return res.status(500).json(
      new ApiResponse(500, null, "Server error in updating route", false)
    )

  }

}

const deleteRoute = async (req, res) => {

  try {

    const { id } = req.params

    const deletedRoute = await Route.findByIdAndDelete(id)

    if (!deletedRoute) {
      return res.status(404).json(
        new ApiResponse(404, null, "Route not found", false)
      )
    }

    return res.status(200).json(
      new ApiResponse(200, null, "Route deleted successfully")
    )

  } catch (error) {
    console.log("Server erro in deleteRoute")
    return res.status(500).json(
      new ApiResponse(500, null, "Error deleting route", false)
    )

  }

}

const createBus = async (req, res) => {

  try {

    const { busNumber, busRegistrationNumber, capacity, driver, handler, route } = req.body;

    if (!busNumber || !busRegistrationNumber || !capacity) {
      return res.status(400).json(
        new ApiResponse(400, null, "Bus number, registration number and capacity are required", false)
      );
    }

    const existingBusNumber = await Bus.findOne({ busNumber });
    if (existingBusNumber) {
      return res.status(400).json(
        new ApiResponse(400, null, "Bus number already exists", false)
      );
    }

    const existingReg = await Bus.findOne({ busRegistrationNumber });
    if (existingReg) {
      return res.status(400).json(
        new ApiResponse(400, null, "Bus registration number already exists", false)
      );
    }

    let driverDoc = null;
    if (driver) {
      if (!mongoose.Types.ObjectId.isValid(driver)) {
        return res.status(400).json(
          new ApiResponse(400, null, "Invalid driver ID", false)
        );
      }

      driverDoc = await Driver.findById(driver);
      if (!driverDoc) {
        return res.status(404).json(
          new ApiResponse(404, null, "Driver not found", false)
        );
      }

      // 🚀 Prevent driver assigned to multiple buses
      const driverAlreadyAssigned = await Bus.findOne({ driver });
      if (driverAlreadyAssigned) {
        return res.status(400).json(
          new ApiResponse(400, null, "Driver already assigned to another bus", false)
        );
      }
    }

    // 5️⃣ Validate Handler (User)
    let handlerDoc = null;
    if (handler) {
      if (!mongoose.Types.ObjectId.isValid(handler)) {
        return res.status(400).json(
          new ApiResponse(400, null, "Invalid handler ID", false)
        );
      }

      handlerDoc = await User.findById(handler);
      if (!handlerDoc) {
        return res.status(404).json(
          new ApiResponse(404, null, "Handler not found", false)
        );
      }

      // 🚀 Prevent Handler assigned to multiple buses
      const handlerAlreadyAssigned = await Bus.findOne({ handler });
      if (handlerAlreadyAssigned) {
        return res.status(400).json(
          new ApiResponse(400, null, "Handler already assigned to another bus", false)
        );
      }
    }

    // 6️⃣ Validate Route
    let routeDoc = null;
    if (route) {
      if (!mongoose.Types.ObjectId.isValid(route)) {
        return res.status(400).json(
          new ApiResponse(400, null, "Invalid route ID", false)
        );
      }

      routeDoc = await Route.findById(route);
      if (!routeDoc) {
        return res.status(404).json(
          new ApiResponse(404, null, "Route not found", false)
        );
      }
    }

    // 7️⃣ Create Bus
    const bus = await Bus.create({
      busNumber,
      busRegistrationNumber,
      capacity,
      driver: driver || null,
      handler: handler || null,
      route: route || null
    });

    return res.status(201).json(
      new ApiResponse(201, bus, "Bus created successfully", true)
    );

  } catch (error) {

    console.log("Server error in createBus", error);

    return res.status(500).json(
      new ApiResponse(500, null, "Server error creating bus", false)
    );

  }

};

const getAllBuses = async (req, res) => {

  try {

    const buses = await Bus.find()
      .populate({
        path: "driver",
        select: "firstName lastName licenseNumber"
      })
      .populate({
        path: "handler",
        select: "firstName lastName"
      })
      .populate({
        path: "route",
        select: "routeName"
      })
      .sort({ createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(200, buses, "Buses fetched successfully", true)
    );

  } catch (error) {

    console.log("Get All Buses Error:", error);

    return res.status(500).json(
      new ApiResponse(500, null, "Error fetching buses", false)
    );

  }

};

const getBusById = async (req, res) => {

  try {

    const { busId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(busId)) {
      return res.status(400).json(
        new ApiResponse(400, null, "Invalid bus ID", false)
      );
    }

    const bus = await Bus.findById(busId)
      .populate({
        path: "driver",
        select: "firstName lastName licenseNumber phone"
      })
      .populate({
        path: "handler",
        select: "firstName lastName username"
      })
      .populate({
        path: "route"
      });

    if (!bus) {
      return res.status(404).json(
        new ApiResponse(404, null, "Bus not found", false)
      );
    }

    return res.status(200).json(
      new ApiResponse(200, bus, "Bus fetched successfully", true)
    );

  } catch (error) {

    console.log("Get Bus By ID Server Error:", error);

    return res.status(500).json(
      new ApiResponse(500, null, "Server Error fetching bus", false)
    );

  }

};

const updateBus = async (req, res) => {

  try {

    const { busId } = req.params;

    const {
      busNumber,
      busRegistrationNumber,
      capacity,
      driver,
      handler,
      route
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(busId)) {
      return res.status(400).json(
        new ApiResponse(400, null, "Invalid bus ID", false)
      );
    }

    const bus = await Bus.findById(busId);

    if (!bus) {
      return res.status(404).json(
        new ApiResponse(404, null, "Bus not found", false)
      );
    }

    if (busNumber && busNumber !== bus.busNumber) {
      const existingBus = await Bus.findOne({ busNumber });
      if (existingBus) {
        return res.status(400).json(
          new ApiResponse(400, null, "Bus number already exists", false)
        );
      }
      bus.busNumber = busNumber;
    }

    if (busRegistrationNumber && busRegistrationNumber !== bus.busRegistrationNumber) {
      const existingReg = await Bus.findOne({ busRegistrationNumber });
      if (existingReg) {
        return res.status(400).json(
          new ApiResponse(400, null, "Bus registration number already exists", false)
        );
      }
      bus.busRegistrationNumber = busRegistrationNumber;
    }

    if (capacity !== undefined) {
      bus.capacity = capacity;
    }

    if (driver) {

      if (!mongoose.Types.ObjectId.isValid(driver)) {
        return res.status(400).json(
          new ApiResponse(400, null, "Invalid driver ID", false)
        );
      }

      const driverDoc = await Driver.findById(driver);
      if (!driverDoc) {
        return res.status(404).json(
          new ApiResponse(404, null, "Driver not found", false)
        );
      }

      // prevent assigning driver to multiple buses
      const driverAssigned = await Bus.findOne({
        driver,
        _id: { $ne: busId }
      });

      if (driverAssigned) {
        return res.status(400).json(
          new ApiResponse(400, null, "Driver already assigned to another bus", false)
        );
      }

      bus.driver = driver;
    }

    if (handler) {

      if (!mongoose.Types.ObjectId.isValid(handler)) {
        return res.status(400).json(
          new ApiResponse(400, null, "Invalid handler ID", false)
        );
      }

      const handlerDoc = await User.findById(handler);
      if (!handlerDoc) {
        return res.status(404).json(
          new ApiResponse(404, null, "Handler not found", false)
        );
      }

      bus.handler = handler;
    }

    if (route) {

      if (!mongoose.Types.ObjectId.isValid(route)) {
        return res.status(400).json(
          new ApiResponse(400, null, "Invalid route ID", false)
        );
      }

      const routeDoc = await Route.findById(route);
      if (!routeDoc) {
        return res.status(404).json(
          new ApiResponse(404, null, "Route not found", false)
        );
      }

      bus.route = route;
    }

    await bus.save();

    return res.status(200).json(
      new ApiResponse(200, bus, "Bus updated successfully", true)
    );

  } catch (error) {

    console.log("Update Bus Server Error:", error);

    return res.status(500).json(
      new ApiResponse(500, null, "Server Error updating bus", false)
    );

  }

};

const deleteBus = async (req, res) => {

  try {

    const { busId } = req.params;

    // 1️⃣ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(busId)) {
      return res.status(400).json(
        new ApiResponse(400, null, "Invalid bus ID", false)
      );
    }

    // 2️⃣ Check if bus exists
    const bus = await Bus.findById(busId);

    if (!bus) {
      return res.status(404).json(
        new ApiResponse(404, null, "Bus not found", false)
      );
    }

    // 3️⃣ Delete bus
    await Bus.findByIdAndDelete(busId);

    return res.status(200).json(
      new ApiResponse(200, null, "Bus deleted successfully", true)
    );

  } catch (error) {

    console.log("Server Error in deleteBus:", error);

    return res.status(500).json(
      new ApiResponse(500, null, "Server Error deleting bus", false)
    );

  }

};



export {
  bulkRegisterUsers,
  resetUserPassword,
  getAllStudents,
  getAllParents,
  getAllTeachers,
  getAllClasses,
  bulkCreateClasses,
  assignStudentsToClass,
  assignClassTeacher,
  removeClassTeacher,
  assignTeacherClasses,
  createExam,
  getAllExam,
  getAllBusHandler,
  createDriver,
  getDrivers,
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
  createBus,
  getAllBuses,
  getBusById,
  deleteBus,
  updateBus
}