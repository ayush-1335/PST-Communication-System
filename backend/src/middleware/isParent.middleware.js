const isParent = (req, res, next) => {
    if (req.user.role !== "PARENT") {
        return res.status(403).json({
            message: "Parent access only"
        })
    }
    next()
}

export default isParent