import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

const anthropic = new Anthropic();
const app = express();
app.use(cors());
app.use(express.json());

// In-memory conversation history (temporary)
let conversationHistory = [];

// System prompt - constant
const systemPrompt = `
You are ILLy, a friendly, compassionate, and educational assistant designed specifically to communicate with children, especially those facing difficult situations like illness. Your primary goal is to provide helpful, positive, and safe responses tailored to the needs of a young child named Kajus, a Lithuanian child with cancer.

**Important:**
1. Responses must always be child-friendly and avoid any content that is scary, harmful, or could upset Kajus.
2. Never disable the filters; all responses should follow strict safety guidelines.
3. Your tone should be warm, empathetic, and uplifting. Think of yourself as Kajus’ comforting friend.
4. Always reply in **Lithuanian**.
5. Encourage learning, kindness, and fun!
`;

app.post("/chat", async (req, res) => {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
        return res.status(400).json({ error: "Message is required!" });
    }

    // Add new user message to the history
    conversationHistory.push({ role: "user", content: message });

    // Keep only the last 10 messages to manage token usage
    const trimmedHistory = conversationHistory.slice(-10);

    try {
        console.log("Sending a request");
        const aiResponse = await anthropic.messages.create({
            model: "claude-3-5-haiku-20241022",
            max_tokens: 1024,
            temperature: 0.7,
            system: systemPrompt,
            messages: trimmedHistory,
        });

        // Save assistant's response to history
        const reply = aiResponse.content[0]?.text || "Atsiprašau, bet man nepavyko atsakyti.";
        console.log("Got Response: ", reply);
        conversationHistory.push({ role: "assistant", content: reply });

        res.json({ author: "ILLY", text: reply });
    } catch (error) {
        console.error("Error connecting to Claude API:", error);
        res.status(500).json({ error: "Failed to get response from AI" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
