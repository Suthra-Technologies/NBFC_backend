module.exports = (requiredPermission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // SUPER_ADMIN bypass
        if (req.user.role === "SUPER_ADMIN") {
            return next();
        }

        if (!req.user.permissions.includes(requiredPermission)) {
            return res.status(403).json({
                success: false,
                message: "Access denied: insufficient permissions",
            });
        }

        next();
    };
};
