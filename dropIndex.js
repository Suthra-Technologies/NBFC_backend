const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
    try {
        // Connect to the base MongoDB cluster
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // The specific tenant database from the error
        const tenantDbUri = `${process.env.MONGO_URI.split('?')[0]}/bank_flashman_bank_db`;
        
        console.log(`Switching to Tenant DB: bank_flashman_bank_db...`);
        const db = mongoose.connection.useDb('bank_flashman_bank_db');

        // Drop the index on the shares collection
        console.log('Dropping certificateNo_1 index from shares collection...');
        await db.collection('shares').dropIndex('certificateNo_1');
        
        console.log('Index successfully dropped!');
    } catch (error) {
        if (error.codeName === 'IndexNotFound') {
            console.log('Index was already dropped.');
        } else {
            console.error('Error:', error);
        }
    } finally {
        mongoose.disconnect();
        console.log('Done.');
    }
}

run();
