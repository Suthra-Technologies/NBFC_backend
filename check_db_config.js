const mongoose = require('mongoose');
require('dotenv').config();

const BankSchema = new mongoose.Schema({
    bankId: String,
    dbName: String,
    subdomain: String
});

async function findDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Bank = mongoose.models.Bank || mongoose.model('Bank', BankSchema);
        const bankById = await Bank.findOne({ _id: '69c0e0bba614808cd9b9e9dd' });
        console.log('--- BANK CONFIG ---');
        if (bankById) {
            console.log('ID:', bankById._id);
            console.log('Subdomain:', bankById.subdomain);
            console.log('DB Name:', bankById.dbName);
        } else {
            console.log('Bank not found in primary DB');
        }
        
        // Also check if any Introducer records exist in primary DB
        const IntroducerSchema = new mongoose.Schema({}, { strict: false });
        const Introducer = mongoose.models.Introducer || mongoose.model('Introducer', IntroducerSchema);
        const primaryCount = await Introducer.countDocuments({ bankId: '69c0e0bba614808cd9b9e9dd' });
        console.log('Introducers in Primary DB for this bank:', primaryCount);
        
        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}

findDb().catch(console.error);
