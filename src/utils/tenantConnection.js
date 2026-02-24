const mongoose = require("mongoose");
const { mongoUri } = require("../config/env");

// Model Schemas
const userSchema = require("../modules/users/user.model").schema;
const branchSchema = require("../modules/branches/branch.model").schema;
const roleSchema = require("../modules/roles/role.model").schema;
const bankSchema = require("../modules/bank/bank.model").schema;
const customerSchema = require("../modules/customers/customer.model").schema;
const loanSchema = require("../modules/loans/loan.model").schema;

const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 50,
};

const connectionPool = {};

/**
 * Get or create a database connection for a specific bank
 */
const getTenantConnection = async (dbName) => {
    if (!dbName) return null;

    if (connectionPool[dbName]) {
        return connectionPool[dbName];
    }

    let baseUri;
    const urlWithoutOptions = mongoUri.split("?")[0];
    const parts = urlWithoutOptions.split("/");

    if (parts.length > 3) {
        baseUri = parts.slice(0, 3).join("/");
    } else {
        baseUri = urlWithoutOptions;
    }

    const tenantUri = `${baseUri}/${dbName}`;

    try {
        const connection = await mongoose.createConnection(tenantUri, connectionOptions).asPromise();

        // Register ALL models on this connection so populate works
        connection.model("User", userSchema);
        connection.model("Branch", branchSchema);
        connection.model("Role", roleSchema); 
        connection.model("Bank", bankSchema); 
        connection.model("Customer", customerSchema);
        connection.model("Loan", loanSchema);

        connectionPool[dbName] = connection;
        console.log(`Connected to Tenant DB: ${dbName}`);
        return connection;
    } catch (error) {
        console.error(`Error connecting to Tenant DB ${dbName}:`, error);
        throw error;
    }
};

module.exports = {
    getTenantConnection,
};
