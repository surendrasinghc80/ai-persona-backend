import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get absolute path to piyush.txt
const promptPath = path.join(process.cwd(), "personas", "piyush.txt");

// Load Piyush persona instructions once
const piyushPersona = fs.readFileSync(promptPath, "utf-8");

/**
 * POST /api/piyush/chat
 * Body: { message: string }
 */
export const piyushChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Create conversation prompt
    const fullPrompt = `
${piyushPersona}

User: ${message}
Piyush:
    `;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: piyushPersona },
        { role: "user", content: message },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const aiReply = completion.choices[0]?.message?.content || "";

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Piyush AI Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
