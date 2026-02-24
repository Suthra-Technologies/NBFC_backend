require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const bankService = require("./modules/bank/bank.service");

const seedSampleBank = async () => {
    try {
        await connectDB();
        console.log("Connected to Main Registry Database...");

        const sampleBankData = {
            name: "Axis Central Bank",
            email: "contact@axis.com",
            phone: "+91 98765 43210",
            maxBranches: 10,
            subdomain: "axis-bank", // Using axis-bank as finware is reserved
            address: {
                line1: "Finance Tower, Sector 62",
                city: "Noida",
                state: "Uttar Pradesh",
                pincode: "201301"
            },
            adminName: "Vijay Kumar",
            adminEmail: "vijay@finware.com",
            adminMobile: "9000000001",
            adminPassword: "Password@123"
        };

        console.log(`Checking if bank '${sampleBankData.subdomain}' already exists...`);
        const Bank = require("./modules/bank/bank.model");
        const existing = await Bank.findOne({ subdomain: sampleBankData.subdomain });

        if (existing) {
            console.log("Sample bank already exists. Skipping creation.");
            process.exit(0);
        }

        console.log("Initializing Sample Bank Node (DB + Roles + Admin)...");
        const bank = await bankService.createBankWithAdmin(sampleBankData);

        console.log("\n===============================================");
        console.log("🎉 SAMPLE BANK CREATED SUCCESSFULLY!");
        console.log("===============================================");
        console.log(`Bank Name: ${bank.name}`);
        console.log(`Subdomain: ${bank.subdomain}`);
        console.log(`Registry ID: ${bank.bankId}`);
        console.log(`Database: ${bank.dbName}`);
        console.log("-----------------------------------------------");
        console.log("LOGIN CREDENTIALS:");
        console.log(`URL: http://localhost:5173/?tenant=${bank.subdomain}`);
        console.log(`Email: ${sampleBankData.adminEmail}`);
        console.log(`Password: ${sampleBankData.adminPassword} (Case Sensitive)`);
        console.log("===============================================\n");

        process.exit(0);
    } catch (error) {
        console.error("Critical Seed Error:", error.message);
        process.exit(1);
    }
};

seedSampleBank();
