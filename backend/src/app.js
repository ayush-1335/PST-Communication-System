import express from "express"
import cors from "cors"

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN
}))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))

import userRouter from "./routes/user.route.js"

app.use("/users", userRouter)

export { app }