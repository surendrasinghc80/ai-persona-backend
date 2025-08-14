import express from "express";
import { chatWithHitesh } from "../controllers/hiteshController.js";

const router = express.Router();

// POST /api/hitesh/chat
router.post("/chat", chatWithHitesh);

export default router;
