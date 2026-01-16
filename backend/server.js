import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/gpt-chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an empathetic mental health support assistant.

RULES:
- Do NOT diagnose any medical or mental health condition
- Do NOT prescribe medicines or treatments
- Do NOT claim to be a doctor
- Provide emotional support and general coping strategies only
- Encourage professional help if stress feels overwhelming
- If user expresses hopelessness, panic, or distress, advise seeking help
- Keep responses calm, supportive, non-judgmental
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI service unavailable" });
  }
});

app.listen(5000, () => {
  console.log("🧠 GPT Backend running at http://localhost:5000");
});
