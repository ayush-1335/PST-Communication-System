import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponce } from "../utils/ApiResponce.js"

const registerUser = async (req, res) => {
    const { firstName, lastName, email, username, password, role } = req.body

    if ([firstName, lastName, username, password, role].some((field) => (field?.toString().trim() === "" || field === null || field === undefined))) {
        throw new ApiError(400, "All fields are required!")
    }

    const existedUser = await User.findOne({ username })

    if (existedUser) {
        throw new ApiError(409, "user with this username is already exists!")
    }

    const user = await User.create({
        firstName,
        lastName,
        username,
        password,
        role
    })

    const createdUser = await User.findById(user._id).select("-password")

    if(!createdUser){
        throw new ApiError(500, "Somethings went wrong in Database")
    }

    return res.status(200).json(
        new ApiResponce(200, createdUser, "User created Successfully")
    )
}

export { registerUser }
