import express from "express";
import dotenv from "dotenv";
import hiteshRoutes from "./routes/hiteshRoutes.js";
import piyushRoutes from "./routes/piyushRoutes.js";
import fs from "fs";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());

// Create chat data folder if not exists
if (!fs.existsSync("./data")) fs.mkdirSync("./data");

app.use(express.json());

// Routes
app.use("/api/hitesh", hiteshRoutes);
app.use("/api/piyush", piyushRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
