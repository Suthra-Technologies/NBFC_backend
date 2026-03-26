const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const BankSchema = new mongoose.Schema({
    dbName: { type: String, default: "" },
    subdomain: String
});

async function findDb() {
    process.stdout.write('Connecting to ' + process.env.MONGO_URI + '...\n');
    try {
        await mongoose.connect(process.env.MONGO_URI);
        process.stdout.write('Connected.\n');
        
        const Bank = mongoose.models.Bank || mongoose.model('Bank', BankSchema);
        const bankById = await Bank.findOne({ _id: new mongoose.Types.ObjectId('69c0e0bba614808cd9b9e9dd') });
        
        console.log('--- BANK CONFIG ---');
        if (bankById) {
            console.log('ID:', bankById._id);
            console.log('Subdomain:', bankById.subdomain);
            console.log('DB Name:', bankById.dbName);
        } else {
            console.log('Bank not found in primary DB');
        }
        
        const IntroducerSchema = new mongoose.Schema({}, { strict: false });
        const Introducer = mongoose.models.Introducer || mongoose.model('Introducer', IntroducerSchema);
        const primaryCount = await Introducer.countDocuments({ bankId: new mongoose.Types.ObjectId('69c0e0bba614808cd9b9e9dd') });
        console.log('Introducers in Primary DB for this bank:', primaryCount);
        
        // Let's also check if ANY introducers exist at all
        const totalCount = await Introducer.countDocuments({});
        console.log('Total Introducers in Primary DB across all banks:', totalCount);

        await mongoose.disconnect();
        process.stdout.write('Done.\n');
    } catch (e) {
        console.error('CRIT ERROR:', e);
    }
}

findDb();
