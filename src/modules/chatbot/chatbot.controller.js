const chatbotService = require("./chatbot.service");

const handleChat = async (req, res, next) => {
    try {
        const { message, history } = req.body;
        console.log("Chatbot Request received:", { message });

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const response = await chatbotService.generateResponse(message, history || []);
        console.log("Chatbot Response generated successfully");

        res.status(200).json({
            success: true,
            data: response,
        });
    } catch (error) {
        console.error("Chatbot Controller Error:", error.message);
        next(error);
    }
};

module.exports = {
    handleChat,
};
