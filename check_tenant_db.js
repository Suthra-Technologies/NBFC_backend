const mongoose = require('mongoose');
require('dotenv').config();

const BankSchema = new mongoose.Schema({
    bankId: String,
    dbName: String,
    subdomain: String
});

async function findDb() {
    await mongoose.connect(process.env.MONGODB_URI);
    const Bank = mongoose.model('Bank', BankSchema);
    const bankById = await Bank.findOne({ _id: '69c0e0bba614808cd9b9e9dd' });
    console.log('Bank By ID:', JSON.stringify(bankById, null, 2));
    await mongoose.disconnect();
}

findDb().catch(console.error);
