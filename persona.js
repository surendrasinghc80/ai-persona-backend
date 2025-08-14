import "dotenv/config";
import { OpenAI } from "openai";
import fs from "fs";

const client = new OpenAI();

async function main() {
  // Load huge content from file
  const hiteshPrompt = fs.readFileSync("./personas/hitesh.txt", "utf-8");

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: hiteshPrompt,
      },
      {
        role: "user",
        content: "sir app appney sabhi coures ka link send kadro?",
      },
    ],
  });

  console.log(response.choices[0].message.content);
}

main();
