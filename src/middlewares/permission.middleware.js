const {
    SUPER_ADMIN,
    BANK_ADMIN,
    BRANCH_MANAGER,
    EMPLOYEE,
    CUSTOMER,
} = require("../constants/roles"); // Note: You might need to create this if it doesn't exist.
const PERMISSIONS = require("../constants/permissions");

/**
 * Middleware to check if the user has the required permission.
 * By default, SUPER_ADMIN has access to everything unless restricted explicitly.
 *
 * @param {string|string[]} requiredPermission - The permission(s) required. If array, user needs at least one.
 */
module.exports = (requiredPermission) => {
    return (req, res, next) => {
        try {
            const user = req.user;

            if (!user) {
                return res.status(401).json({ message: "Authentication required" });
            }

            // 1. Super Admin Bypass (optional, but good for platform owners)
            // Check if user role is SUPER_ADMIN.
            if (user.role === "SUPER_ADMIN") {
                return next();
            }

            // 2. Check Permissions
            const userPermissions = user.permissions || [];
            const permissionsToCheck = Array.isArray(requiredPermission)
                ? requiredPermission
                : [requiredPermission];

            // Check if user has ALL required permissions (AND logic) or ANY (OR logic).
            // Usually for route guards, it's specific. Let's assume ANY for array inputs if we want flexibility,
            // but strictly, "requirePermission" implies specific capability.
            // If we pass ['A', 'B'], let's assume they need ONE of them to proceed?
            // Or if we pass 'A', they need 'A'.
            // Let's implement OR logic for array inputs: "Has permission A OR B".

            const hasAccess = permissionsToCheck.some((p) =>
                userPermissions.includes(p)
            );

            if (!hasAccess) {
                return res.status(403).json({
                    message: "Access Denied: Insufficient Permissions",
                    required: permissionsToCheck,
                });
            }

            next();
        } catch (error) {
            console.error("Permission middleware error:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };
};
