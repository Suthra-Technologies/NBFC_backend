const mongoose = require('mongoose');
require('dotenv').config();

const introducerSchema = require('./src/modules/producer-company/introduced-details/models/introducer.model').schema;

async function checkIntroducer() {
    await mongoose.connect(process.env.MONGODB_URI);
    const Introducer = mongoose.model('Introducer', introducerSchema);
    const result = await Introducer.find({ employeeName: /Test/ }).limit(10);
    console.log(JSON.stringify(result, null, 2));
    await mongoose.disconnect();
}

checkIntroducer().catch(console.error);
