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
    const { firstName, lastName, email, username, password, role, standard, address, phone, subject } = req.body

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

    existedUser = await User.findOne({ email })

    if (existedUser) {
        return res.status(409).json(
            new ApiResponse(409, null, "user with this email already exists!")
        )
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
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

        await Student.create({
            user: user._id,
            studentCode,
            standard,
            address
        })
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

// const getUserDetails = async (req, res) => {
//     const user = req.user

//     return res.status(200)
//         .json(
//             new ApiResponse(200, user, "User details fetch successfully")
//         )
// }

const getUserProfile = async (req, res) => {
    const userId = req.user.userId
    const user = await User.findById(userId).select("-password")

    if (!user) {
        return res.status(404)
            .json(
                new ApiResponse(404, null, "User not found")
            )
    }

    if (!user.isActive) {
        return res.status(403)
            .json(
                new ApiResponse(403, null, "User account is disabled")
            )
    }

    return res.status(200)
    .json(
        new ApiResponse(200, user, "User profile fetch Successfully")
    )

}


export { registerUser, loginUser, logoutUser, getUserProfile }
