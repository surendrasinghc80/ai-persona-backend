import fs from "fs";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatWithHitesh = async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Load persona
    const hiteshPrompt = fs.readFileSync("./personas/hitesh.txt", "utf-8");

    // Read chat history (if file exists)
    let history = [];
    if (fs.existsSync("./data/chats.json")) {
      const rawData = fs.readFileSync("./data/chats.json", "utf-8");
      history = JSON.parse(rawData);
    }

    // Convert history to OpenAI message format
    const formattedHistory = history
      .map((entry) => [
        { role: "user", content: entry.user },
        { role: "assistant", content: entry.bot },
      ])
      .flat();

    // Prepare messages for OpenAI
    const messages = [
      { role: "system", content: hiteshPrompt },
      ...formattedHistory,
      { role: "user", content: userMessage },
    ];

    // Call OpenAI
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
    });

    const botMessage = response.choices[0].message.content;

    // Save updated chat history
    const newHistory = [
      ...history,
      {
        timestamp: new Date().toISOString(),
        user: userMessage,
        bot: botMessage,
      },
    ];
    fs.writeFileSync("./data/chats.json", JSON.stringify(newHistory, null, 2));

    res.json({ reply: botMessage });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
