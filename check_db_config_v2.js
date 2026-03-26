const mongoose = require('mongoose');
require('dotenv').config();

const BankSchema = new mongoose.Schema({
    bankId: String,
    dbName: { type: String, default: "" },
    subdomain: String
});

async function findDb() {
    process.stdout.write('Connecting to MongoDB...\n');
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        process.stdout.write('Connected.\n');
        
        const Bank = mongoose.models.Bank || mongoose.model('Bank', BankSchema);
        const bankById = await Bank.findOne({ _id: new mongoose.Types.ObjectId('69c0e0bba614808cd9b9e9dd') });
        
        console.log('--- BANK CONFIG ---');
        if (bankById) {
            console.log('ID:', bankById._id);
            console.log('Subdomain:', bankById.subdomain);
            console.log('DB Name:', bankById.dbName);
        } else {
            console.log('Bank not found in primary DB (check ID)');
            const allBanks = await Bank.find({}).limit(5);
            console.log('Sample Banks:', allBanks.map(b => b.subdomain));
        }
        
        const Introducer = mongoose.models.Introducer || mongoose.model('Introducer', new mongoose.Schema({}, { strict: false }));
        const primaryCount = await Introducer.countDocuments({ bankId: new mongoose.Types.ObjectId('69c0e0bba614808cd9b9e9dd') });
        console.log('Introducers in Primary DB for this bank:', primaryCount);
        
        await mongoose.disconnect();
        process.stdout.write('Done.\n');
    } catch (e) {
        console.error('CRIT ERROR:', e);
    }
}

findDb();
