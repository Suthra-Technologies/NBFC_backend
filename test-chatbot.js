require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    // Trying with models/ prefix which is sometimes required or more specific
    const modelsToTry = ["models/gemini-1.5-flash", "models/gemini-pro"];

    for (const modelName of modelsToTry) {
        console.log(`Testing model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            const response = await result.response;
            console.log(`SUCCESS with ${modelName}:`, response.text());
            return;
        } catch (error) {
            console.error(`FAILED with ${modelName}:`, error.message);
        }
    }
}

test();
