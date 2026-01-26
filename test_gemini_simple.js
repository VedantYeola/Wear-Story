
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY_HERE";

console.log("Testing API Key:", apiKey ? "Found key ending in " + apiKey.slice(-4) : "Not Found");

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run() {
    try {
        const result = await model.generateContent("Say 'Hello from Gemini' if you can hear me.");
        const response = await result.response;
        console.log("Response:", response.text());
    } catch (error) {
        console.error("Error:", error);
    }
}

run();
