
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyD3GcHeUK7aZiFttMeRZ_LX7kOBvhjQ1f8";
const genAI = new GoogleGenerativeAI(apiKey);

const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-pro",
    "gemini-1.5-pro"
];

async function testModel(modelName) {
    console.log(`Testing ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hi");
        const response = await result.response;
        console.log(`SUCCESS: ${modelName} responded: ${response.text()}`);
        return true;
    } catch (error) {
        console.log(`FAILED: ${modelName} - ${error.message?.slice(0, 100)}`);
        return false;
    }
}

async function run() {
    for (const m of modelsToTry) {
        const success = await testModel(m);
        if (success) break;
    }
}

run();
