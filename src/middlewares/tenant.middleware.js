const Bank = require("../modules/bank/bank.model");
const { getTenantConnection } = require("../utils/tenantConnection");

/**
 * Middleware to detect tenant (bank) from subdomain
 * and establish database connection
 */
module.exports = async (req, res, next) => {
    const host = req.get("host");
    if (!host) return next();

    const hostname = host.split(":")[0];
    const parts = hostname.split(".");

    let subdomain = null;
    if (hostname.includes("localhost")) {
        if (parts.length > 1) subdomain = parts[0];
    } else if (parts.length > 2) {
        subdomain = parts[0];
    }

    if (subdomain && !["www", "api", "admin"].includes(subdomain.toLowerCase())) {
        try {
            const bank = await Bank.findOne({
                subdomain: subdomain.toLowerCase(),
                isDeleted: false
            });

            if (bank) {
                req.tenant = bank;

                // If bank has a dedicated database, switch connection
                if (bank.dbName) {
                    const connection = await getTenantConnection(bank.dbName);

                    // Attach models bounded to this connection for easy access in controllers
                    // Controllers should use req.models.User instead of require('user.model')
                    req.models = {
                        User: connection.model("User"),
                        Branch: connection.model("Branch"),
                    };
                }
            }
        } catch (error) {
            console.error("Tenant Middleware Error:", error);
        }
    }

    next();
};
