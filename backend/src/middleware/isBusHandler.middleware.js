const isBusHandler = (req, res, next) => {
    if (!req.user || req.user.role !== "TRANSPORT_HANDLER") {
        return res.status(403).json({
            message: "Transport Handler access only"
        })
    }
    next()
}

export default isBusHandler