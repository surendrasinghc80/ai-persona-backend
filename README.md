# AI Persona Backend 🤖

A powerful Node.js backend application that creates realistic AI personas using OpenAI's GPT-4.1-mini model. This project allows you to chat with different AI personalities, each with their own unique characteristics, speaking styles, and knowledge bases.

## 🌟 Features

### Core Features

- **Multiple AI Personas**: Support for multiple distinct AI personalities
- **Real-time Chat**: Interactive chat functionality with AI personas
- **Chat History**: Automatic storage of all conversations in JSON format
- **RESTful API**: Clean REST endpoints for easy integration
- **Modular Architecture**: Organized with separate routes, controllers, and persona definitions
- **CORS Support**: Cross-origin resource sharing enabled for frontend integration

### Current Personas

1. **Hitesh Choudhary** - Tech educator and mentor

   - Speaks in Hinglish (Hindi + English blend)
   - Uses relatable analogies and pop-culture references
   - Provides practical coding advice and motivation
   - Includes social media links and course recommendations

2. **Piyush** - Another unique persona with distinct characteristics

### Technical Features

- **OpenAI Integration**: Uses GPT-4.1-mini for intelligent responses
- **Environment Configuration**: Secure API key management with dotenv
- **Express.js Framework**: Fast and minimal web framework
- **ES Modules**: Modern JavaScript module system
- **Auto-restart**: Development server with nodemon for hot reloading
- **File-based Storage**: Simple JSON file storage for chat history

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- OpenAI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd ai-persona-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file and add your OpenAI API key:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   Or for production:

   ```bash
   npm start
   ```

The server will start on `http://localhost:5000` (or your specified PORT).

## 📡 API Endpoints

### Hitesh Persona

- **POST** `/api/hitesh/chat`
  - Send a message to Hitesh persona
  - **Body**: `{ "message": "Your message here" }`
  - **Response**: `{ "response": "AI response" }`

### Piyush Persona

- **POST** `/api/piyush/chat`
  - Send a message to Piyush persona
  - **Body**: `{ "message": "Your message here" }`
  - **Response**: `{ "response": "AI response" }`

### Example Usage

```javascript
// Using fetch API
const response = await fetch("http://localhost:5000/api/hitesh/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: "Can you explain React hooks?",
  }),
});

const data = await response.json();
console.log(data.response);
```

```bash
# Using curl
curl -X POST http://localhost:5000/api/hitesh/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are your best JavaScript courses?"}'
```

## 🎭 Creating Your Own Persona

### Step 1: Create Persona Definition

Create a new text file in the `personas/` directory (e.g., `personas/yourname.txt`):

```txt
You are an AI assistant who is [Your Persona Name].

Tone: [Describe the speaking style, e.g., Professional, Casual, Humorous]

Tone & Style:
- [Characteristic 1]: Description
- [Characteristic 2]: Description
- [Characteristic 3]: Description

Key Characteristics:
- [Trait 1]: Description
- [Trait 2]: Description
- [Trait 3]: Description

Special Instructions:
- [Any specific behavior instructions]
- [Response patterns or phrases to use/avoid]

Background Information:
[Add detailed background, expertise areas, personal details that make the persona unique]

Social Links (if applicable):
- Website: [URL]
- Twitter: [URL]
- LinkedIn: [URL]
```

### Step 2: Create Controller

Create `controllers/yournameController.js`:

```javascript
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
    persona: "yourname", // Add persona identifier
  });

  fs.writeFileSync(chatFile, JSON.stringify(chats, null, 2));
}

export const chatWithYourname = async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Load persona prompt
    const yournamePrompt = fs.readFileSync(
      path.join(process.cwd(), "personas", "yourname.txt"),
      "utf8"
    );

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: yournamePrompt },
        { role: "user", content: userMessage },
      ],
    });

    const botMessage = response.choices[0].message.content || "";

    // Save chat history
    saveChat(userMessage, botMessage);

    res.json({ response: botMessage });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
```

### Step 3: Create Routes

Create `routes/yournameRoutes.js`:

```javascript
import express from "express";
import { chatWithYourname } from "../controllers/yournameController.js";

const router = express.Router();

// POST /api/yourname/chat
router.post("/chat", chatWithYourname);

export default router;
```

### Step 4: Register Routes

Add your routes to `server.js`:

```javascript
import yournameRoutes from "./routes/yournameRoutes.js";

// Add this line with other route registrations
app.use("/api/yourname", yournameRoutes);
```

## 📁 Project Structure

```
ai-persona-backend/
├── controllers/           # Business logic for each persona
│   ├── hiteshController.js
│   ├── piyushController.js
│   └── [yournameController.js]
├── data/                 # Chat history storage
│   └── chats.json
├── personas/             # Persona definitions and prompts
│   ├── hitesh.txt
│   ├── piyush.txt
│   └── [yourname.txt]
├── routes/               # API route definitions
│   ├── hiteshRoutes.js
│   ├── piyushRoutes.js
│   └── [yournameRoutes.js]
├── .env                  # Environment variables (not in repo)
├── .env.example          # Environment template
├── .gitignore
├── package.json
├── persona.js            # Simple test script
├── server.js             # Main application entry point
└── README.md
```

## 🛠️ Development

### Available Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Install dependencies and start dev server
npm run dev-setup

# Run test script
npm test
```

### Environment Variables

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

### Dependencies

- **express**: Web framework for Node.js
- **openai**: Official OpenAI API client
- **dotenv**: Environment variable management
- **cors**: Cross-origin resource sharing
- **nodemon**: Development auto-restart utility

## 🔧 Configuration

### OpenAI Model Configuration

The project uses `gpt-4.1-mini` by default. You can modify the model in the controller files:

```javascript
const response = await client.chat.completions.create({
  model: "gpt-4.1-mini", // Change this to your preferred model
  messages: [
    { role: "system", content: personaPrompt },
    { role: "user", content: userMessage },
  ],
});
```

### Chat History Storage

Chat conversations are automatically saved to `data/chats.json`. Each entry includes:

- Timestamp
- User message
- Bot response
- Persona identifier (if implemented)

## 🚀 Deployment

### Local Deployment

```bash
npm install
npm start
```

### Production Considerations

- Set `NODE_ENV=production`
- Use a process manager like PM2
- Set up proper logging
- Configure reverse proxy (nginx)
- Use a proper database for chat history in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-persona`)
3. Commit your changes (`git commit -am 'Add new persona'`)
4. Push to the branch (`git push origin feature/new-persona`)
5. Create a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Common Issues

1. **OpenAI API Key Error**

   - Ensure your API key is correctly set in `.env`
   - Check if your OpenAI account has sufficient credits

2. **Port Already in Use**

   - Change the PORT in `.env` file
   - Kill the process using the port: `lsof -ti:5000 | xargs kill -9`

3. **Module Import Errors**

   - Ensure `"type": "module"` is in `package.json`
   - Use `.js` extensions in import statements

4. **Chat History Not Saving**
   - Check if `data/` directory exists
   - Verify write permissions

## 🎯 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication and sessions
- [ ] Real-time chat with WebSockets
- [ ] Persona management dashboard
- [ ] Chat history search and filtering
- [ ] Rate limiting and security features
- [ ] Docker containerization
- [ ] Unit and integration tests

## 📞 Support

For questions and support:

- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

---

**Happy coding! 🚀**
