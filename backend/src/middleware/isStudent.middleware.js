const isStudent = (req, res, next) => {
    if (req.user.role !== "STUDENT") {
        return res.status(403).json({
            message: "Student access only"
        })
    }
    next()
}

export default isStudent