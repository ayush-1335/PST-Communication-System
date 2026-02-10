const isTeacher = (req, res, next) => {
    if (req.user.role !== "TEACHER") {
        return res.status(403).json({
            message: "Teacher access only"
        })
    }
    next()
}

export default isTeacher