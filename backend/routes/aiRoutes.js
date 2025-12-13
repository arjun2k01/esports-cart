import express from "express";
import rateLimit from "express-rate-limit";
import fetch from "node-fetch";
import { protect } from "../middleware/authMiddleware.js";

// AI route limiter
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "AI usage limit reached. Try again in a minute.",
});

const router = express.Router();

// Sanitize text
const sanitize = (text) =>
  String(text).replace(/(<([^>]+)>)/gi, "").trim().slice(0, 500);

// POST /api/ai/analyze
router.post("/analyze", protect, aiLimiter, async (req, res) => {
  try {
    let { prompt } = req.body;

    if (!prompt)
      return res.status(400).json({ message: "Prompt is required" });

    prompt = sanitize(prompt);

    if (prompt.length < 2)
      return res.status(400).json({ message: "Invalid prompt" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
      return res.status(500).json({ message: "AI key missing" });

    // Gemini / Generative AI request
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!data.candidates || !data.candidates[0])
      return res.status(500).json({ message: "AI response error" });

    const aiText = data.candidates[0].content.parts[0].text || "No response";

    res.json({ result: aiText });
  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ message: "AI request failed" });
  }
});

export default router;
