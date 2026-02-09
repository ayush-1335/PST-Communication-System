import { Teacher } from "../models/teacher.model.js";
import { Class } from "../models/class.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getMyStudents = async (req, res) => {
  try {
    // 1️⃣ Get logged-in user id
    const userId = req.user.userId;

    // 2️⃣ Find teacher by user id
    const teacher = await Teacher.findOne({ user: userId });

    if (!teacher) {
      return res.status(404).json(
        new ApiResponse(404, null, "Teacher profile not found", false)
      );
    }

    // 3️⃣ Find class where teacher is classTeacher
    const classDoc = await Class.findOne({
      classTeacher: teacher._id,
    })
      .populate({
        path: "students",
        select: "standard rollNumber user",
        populate: {
          path: "user",
          select: "firstName lastName username",
        },
      });

    // 4️⃣ If teacher has no class
    if (!classDoc) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            class: null,
            students: [],
          },
          "No class assigned to this teacher"
        )
      );
    }

    // 5️⃣ Success response
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          class: `${classDoc.standard}-${classDoc.section}`,
          students: classDoc.students,
        },
        "Students fetched successfully"
      )
    );
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message, false)
    );
  }
}

const getMyClasses = async (req, res) => {
  const userId = req.user.userId
  // console.log(userId);


  const teacher = await Teacher.findOne({ user: userId })
    .populate({
      path: "classes",
      select: "_id standard section"
    });

  if (!teacher) {
    return res.status(404).json(
      new ApiResponse(404, null, "Teacher profile not found", false)
    );
  }

  const classes = teacher.classes

  return res.status(200).json(
    new ApiResponse(200, classes, "Classes fetched Successfully", true)
  )

}

export { getMyStudents, getMyClasses }