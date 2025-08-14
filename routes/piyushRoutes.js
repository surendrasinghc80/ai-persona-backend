import express from "express";
import { piyushChat } from "../controllers/piyushController.js";

const router = express.Router();

// POST /api/piyush/chat
router.post("/chat", piyushChat);

export default router;
