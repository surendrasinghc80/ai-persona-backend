import fs from "fs";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const piyushChat = async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Load persona
    const piyushPrompt = fs.readFileSync("./personas/piyush.txt", "utf-8");

    // Read chat history (if file exists)
    let history = [];
    if (fs.existsSync("./data/piyush_chats.json")) {
      const rawData = fs.readFileSync("./data/piyush_chats.json", "utf-8");
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
      {
        role: "system",
        content: `${piyushPrompt}

      ⚠️ VERY IMPORTANT — ALWAYS FOLLOW THESE RULES ⚠️
      - Break content into **short readable sections**.
      - Use **emojis** to make it fun (🔥, 🚀, 😎, 🎯, 💡, 📌).
      - Always add **two line breaks** between sections.
      - For lists: use
        1. Numbered format for steps
        2. Bullet points (• or -) for unordered info
      - Use **Markdown headings** like ### and ####.
      - Avoid writing large walls of text — max 3–4 lines per paragraph.
      - Always make the answer visually skimmable for the reader.`,
      },
      ...formattedHistory,
      { role: "user", content: userMessage },
    ];

    // Call OpenAI
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
    });

    function formatBotMessage(text) {
      // Ensure double line breaks between paragraphs
      let formatted = text.replace(/([^\n])\n([^\n])/g, "$1\n\n$2");

      // Replace " - " at line start with bullets
      formatted = formatted.replace(/^\s*-\s+/gm, "• ");

      // Ensure numbered lists have correct spacing
      formatted = formatted.replace(/(\d\.)\s+/g, "$1 ");

      return formatted.trim();
    }

    const botMessage = formatBotMessage(response.choices[0].message.content);

    // Save updated chat history
    const newHistory = [
      ...history,
      {
        timestamp: new Date().toISOString(),
        user: userMessage,
        bot: botMessage,
      },
    ];
    fs.writeFileSync(
      "./data/piyush_chats.json",
      JSON.stringify(newHistory, null, 2)
    );

    res.json({ reply: botMessage });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
