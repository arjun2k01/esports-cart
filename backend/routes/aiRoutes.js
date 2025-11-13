import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import axios from 'axios';

const router = express.Router();

// @desc    Generate AI response
// @route   POST /api/ai/generate
// @access  Private
router.post('/generate', protect, async (req, res) => {
  const { userQuery, systemPrompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing in backend .env");
    return res.status(500).json({ message: "AI Service configuration error" });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
  };

  try {
    const response = await axios.post(apiUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
        throw new Error("Invalid response structure from Gemini");
    }

    res.json({ text });
  } catch (error) {
    console.error("AI API Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to generate AI insight" });
  }
});

export default router;