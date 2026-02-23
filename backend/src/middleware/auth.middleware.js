import jwt from "jsonwebtoken"
import { ApiResponse } from "../utils/ApiResponse.js"

const authMiddleware = async(req, res, next) => {
    try {
        
        const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "")

        if(!token){
            return res.status(401).json({ success: false, message: "Unauthorized!" });
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        )

        req.user = decoded

        next()

    } catch (error) {
        return res.status(401).json(
            new ApiResponse(401, null, "Invalid or expired token", false)
        )

    }
}

export default authMiddleware