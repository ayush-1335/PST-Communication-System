import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { ApiResponce } from "../utils/ApiResponce.js"

const authMiddleware = async(req, res, next) => {
    try {
        
        const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "")

        if(!token){
            return res
            .status(401)
            .json(
                new ApiResponce(401, null, "Access Token expired!", false)
            )
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        )

        req.user = decoded

        next()

    } catch (error) {
        throw new ApiError(401, "Error while checking Token!")
    }
}

export default authMiddleware