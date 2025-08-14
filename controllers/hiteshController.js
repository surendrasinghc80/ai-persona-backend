import dotenv from "dotenv";
import fs from "fs";
import { OpenAI } from "openai";
import path from "path";
dotenv.config();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple function to store chats in JSON
function saveChat(userMessage, botMessage) {
  const chatFile = "./data/chats.json";

  let chats = [];
  if (fs.existsSync(chatFile)) {
    chats = JSON.parse(fs.readFileSync(chatFile, "utf-8"));
  }

  chats.push({
    timestamp: new Date(),
    user: userMessage,
    bot: botMessage,
  });

  fs.writeFileSync(chatFile, JSON.stringify(chats, null, 2));
}

export const chatWithHitesh = async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Load persona prompt with preserved newlines
    const hiteshPrompt = fs.readFileSync(
      path.join(process.cwd(), "personas", "hitesh.txt"),
      "utf8"
    );

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: hiteshPrompt },
        { role: "user", content: userMessage },
      ],
    });

    let botMessage = response.choices[0].message.content || "";

    // Ensure proper line breaks
    botMessage = botMessage.replace(/\r\n/g, "\n"); // normalize Windows/Mac line endings

    saveChat(userMessage, botMessage);

    res.json({ reply: botMessage });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
