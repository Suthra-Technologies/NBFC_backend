const Bank = require("../modules/bank/bank.model");

/**
 * Middleware to detect tenant (bank) from subdomain
 */
module.exports = async (req, res, next) => {
    const host = req.get("host");
    if (!host) return next();

    // Remove port if present
    const hostname = host.split(":")[0];
    const parts = hostname.split(".");

    // Example: bank1.nbfc.com or bank1.localhost
    // If localhost: parts.length > 1 (bank1.localhost)
    // If nbfc.com: parts.length > 2 (bank1.nbfc.com)

    // A more robust way is to check against a BASE_DOMAIN from config
    // For now, we'll assume the first part is the subdomain if parts.length > 2
    // or if parts.length > 1 and it's localhost

    let subdomain = null;

    if (hostname.includes("localhost")) {
        if (parts.length > 1) {
            subdomain = parts[0];
        }
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
            }
        } catch (error) {
            console.error("Tenant Middleware Error:", error);
        }
    }

    next();
};
