import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { Teacher } from "../models/teacher.model.js"
import { Student } from "../models/student.model.js"
import { Parent } from "../models/parent.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { generateAccessToken } from "../utils/token.js"
import generateStudentCode from "../utils/generateStudentCode.js"
import mongoose from "mongoose"


const registerUser = async (req, res) => {
    const { firstName, lastName, username, password, role, standard, address, phone, subject } = req.body

    if ([firstName, lastName, username, password, role].some((field) => (field?.toString().trim() === "" || field === null || field === undefined))) {
        return res.status(400).json(
            new ApiResponse(400, null, "All fields are required!")
        )
    }

    let existedUser = await User.findOne({ username })

    if (existedUser) {
        return res.status(409).json(
            new ApiResponse(409, null, "user with this username already exists!")
        )
    }

    const user = await User.create({
        firstName,
        lastName,
        username,
        password,
        role
    })

    const createdUser = await User.findById(user._id).select("-password")

    if (!createdUser) {
        throw new ApiError(500, "Somethings went wrong in Database")
    }

    if (role === "STUDENT") {

        const studentCode = await generateStudentCode()

        const student = await Student.create({
            user: user._id,
            studentCode,
            standard,
            address
        })

        console.log(student)
    }

    if (role === "TEACHER") {
        await Teacher.create({
            user: user._id,
            subject
        })
    }

    if (role === "PARENT") {
        await Parent.create({
            user: user._id,
            phone
        })
    }

    return res.status(200).json(
        new ApiResponse(200, createdUser, "User created Successfully")
    )
}

const loginUser = async (req, res) => {
    const { username, password } = req.body

    if (username === "" || username === null || username === undefined) {
        // throw new ApiError(400, "Username required!")
        return res
            .status(409)
            .json(
                new ApiResponse(409, null, "username required", false)
            )
    }

    if (password === "" || password === null || password === undefined) {
        // throw new ApiError(400, "Username required!")
        return res
            .status(409)
            .json(
                new ApiResponse(409, null, "password required", false)
            )
    }

    const user = await User.findOne({ username }).select("+password")

    // console.log(user)

    if (user === null || user === undefined) {
        return res
            .status(409)
            .json(
                new ApiResponse(409, null, "Invalid username", false)
            )
    }

    const isUserVerifed = await user.isPasswordCorrect(password)
    // console.log(isUserVerifed);

    if (!isUserVerifed) {
        return res
            .status(409)
            .json(
                new ApiResponse(409, null, "Invalid Password", false)
            )
    }

    if (!user.isActive) {
        throw new ApiError(400, "User's account is disabled!")
    }

    const accessToken = generateAccessToken(user)

    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
    }

    const safeUser = {
        _id: user._id,
        role: user.role,
        firstname: user.firstName,
        lastName: user.lastName
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(200, {
                safeUser,
            }, "User LoggedIn Successfully")
        )

}

const logoutUser = async (req, res) => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(
            new ApiResponse(200, null, "User logout Successfully", true)
        )
}

const getUserProfile = async (req, res) => {
    const userId = req.user.userId;

    const userDoc = await User.findById(userId).select("-password");

    if (!userDoc) {
        return res.status(404).json(
            new ApiResponse(404, null, "User not found")
        );
    }

    if (!userDoc.isActive) {
        return res.status(403).json(
            new ApiResponse(403, null, "User account is disabled")
        );
    }

    // convert mongoose document → plain object
    const user = userDoc.toObject();

    if (user.role === "STUDENT") {
        const student = await Student.findOne({ user: userId })
            .select("address standard studentCode -_id");

        if (!student) {
            return res.status(404).json(
                new ApiResponse(404, null, "Student profile not found")
            );
        }

        user.address = student.address;
        user.standard = student.standard;
        user.studentCode = student.studentCode;
    }

    if (user.role === "PARENT") {
        const parent = await Parent.findOne({ user: userId })
            .select("phone -_id");

        if (!parent) {
            return res.status(404).json(
                new ApiResponse(404, null, "Parent profile not found")
            );
        }

        user.phone = parent.phone;
    }

    if (user.role === "TEACHER") {
        const teacher = await Teacher.findOne({ user: userId })
            .select("subject -_id");

        if (!teacher) {
            return res.status(404).json(
                new ApiResponse(404, null, "Teacher profile not found")
            );
        }

        user.subject = teacher.subject;
    }

    // console.log("Profile :", user);

    return res.status(200).json(
        new ApiResponse(200, user, "User profile fetch Successfully")
    );
}

const getAllStudents = async (req, res) => {

    // console.log("IN get all students")

    try {
        const students = await Student.find({})
            .select("standard section user _id")
            .populate({
                path: "user",
                select: "firstName lastName username -_id",
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

    // console.log("IN get all teachers")

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


export { registerUser, loginUser, logoutUser, getUserProfile, getAllStudents, getAllParents, getAllTeachers }
