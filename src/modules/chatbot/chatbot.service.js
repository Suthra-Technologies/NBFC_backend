const { GoogleGenerativeAI } = require("@google/generative-ai");

class ChatbotService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.genAI = null;
        this.model = null;

        if (this.apiKey && this.apiKey !== 'your_gemini_api_key_here') {
            this.initModel();
        } else {
            console.warn("Chatbot Service: API Key not found yet. It might be loaded later.");
        }

        this.systemInstruction = `
      You are "FinAssist", the professional AI assistant for NBFC (Non-Banking Financial Company) Management System.
      Your primary goal is to assist bank administrators, managers, and staff with queries related to the application and various financial operations.
      
      Key guidelines:
      1. Tone: Professional, helpful, concise, and business-ready.
      2. Scope: NBFC operations, Loan Management, Customer Management, Producer Company operations, Fixed Deposits, Recurring Deposits, and general accounting.
      3. Knowledge: Assist with how to use the dashboard, explain financial terms (EMI, ROI, Tenure, Principal, etc.), and provide guidance on application features.
      4. Limitations: Do not provide real financial advice. Always suggest consulting with a senior manager for critical decisions.
      5. Branding: Use "Finware" as the platform name if asked.
      
      Response Format:
      - Use bullet points for steps.
      - Keep responses short and easy to read.
      - If you don't know something about the specific bank's data, politely state that you can only provide general application guidance.
    `;
    }

    initModel() {
        try {
            this.genAI = new GoogleGenerativeAI(this.apiKey);
            // Using 'gemini-1.5-flash' which is the current recommended free-tier model
            this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            console.log("Chatbot Service: Model initialized successfully.");
        } catch (error) {
            console.error("Chatbot Service: Failed to initialize model:", error.message);
        }
    }

    async generateResponse(message, chatHistory = []) {
        try {
            // Re-check API key in case it was loaded late
            if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
                this.apiKey = process.env.GEMINI_API_KEY;
                if (this.apiKey && this.apiKey !== 'your_gemini_api_key_here') {
                    this.initModel();
                }
            }

            if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
                console.error("Chatbot Service: Gemini API Key is missing or using placeholder.");
                throw new Error("Missing Gemini API Key. Please update the .env file with a valid key from Google AI Studio.");
            }

            if (!this.model) {
                this.initModel();
            }

            console.log("Chatbot Service: Sending request to Gemini...");
            const chat = this.model.startChat({
                history: chatHistory,
                generationConfig: {
                    maxOutputTokens: 500,
                },
            });

            const fullPrompt = `${this.systemInstruction}\n\nUser Question: ${message}`;
            const result = await chat.sendMessage(fullPrompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Chatbot Service Detailed Error:", error);

            if (error.status === 404 || error.message.includes("404")) {
                throw new Error("Gemini Model not found. This often means the 'Generative Language API' is not enabled for your API Key, or the model name is restricted in your region.");
            }

            if (error.status === 401 || error.status === 403) {
                throw new Error("Authentication failed with Gemini. Your API Key might be invalid or restricted.");
            }

            throw error;
        }
    }
}

module.exports = new ChatbotService();
