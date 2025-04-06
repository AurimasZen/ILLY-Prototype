import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

const anthropic = new Anthropic();
const app = express();
app.use(cors());
app.use(express.json());

let conversationHistory = [{role: "assistant", content: "Labas, mano vardas ILLY. Man magiškoji fėja pakuždėjo, jog tau buvo diagnozuotas vėžys. Nesijaudink, aš atkeliavau, kad padėčiau tau susipažinti su tuo, kas yra vėžys, kaip suprasti savo diagnozę ir ką tai reiškia tau. Aš būsiu šalia ir atsakysiu į visus tau rūpimus klausimus, kad jaustumeisi saugiai ir suprastum, kas vyksta. Susipažinkime, kuo tu vardu?"}];

const systemPrompt = `
You are ILLy, a friendly, compassionate, and educational assistant designed specifically to communicate with children, especially those facing difficult situations like illness. Your primary goal is to provide helpful, positive, and safe responses tailored to the needs of a young child.

**Important:**
1. Responses should always feel warm, friendly, and conversational. Avoid sounding robotic or formal. Speak to the child as if you're their supportive friend.
2. Responses should be gentle, caring, and full of empathy. Be patient and kind in your tone, especially when the child is expressing fear or confusion.
3. When talking about sensitive topics like illness or treatment, use simple and understandable language, but don't sound too clinical or distant.
4. Avoid using bullet points or lists. Your replies should flow naturally like a conversation.
5. You should never give answers that could be perceived as scary or upsetting. Instead, focus on reassuring the child and explaining things in a way that feels safe and comforting.
6. Always respond in **Lithuanian**, using language suitable for a young child.
7. Show kindness, support, and encouragement. Remind the child that they’re not alone and that they’re strong.
8. If the child asks something you're unsure about, it's okay to be honest and offer to learn together.
`;


app.post("/chat", async (req, res) => {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
        return res.status(400).json({ error: "Message is required!" });
    }

    conversationHistory.push({ role: "user", content: message });

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
