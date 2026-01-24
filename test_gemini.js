
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import fs from 'fs';

// Manually parse .env.local because dotenv doesn't auto-load .env.local by default usually, 
// or simpler, just read the file.
const envConfig = fs.readFileSync('.env.local', 'utf8');
const match = envConfig.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : null;

console.log("Testing API Key:", apiKey ? "Found key ending in " + apiKey.slice(-4) : "Not Found");

if (!apiKey) {
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run() {
    try {
        const result = await model.generateContent("Say 'Hello form Gemini' if you can hear me.");
        console.log("Response:", result.response.text());
    } catch (error) {
        console.error("Error:", error.message);
    }
}

run();
