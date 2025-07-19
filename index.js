const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
app.use(cors()); 
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const PORT = 3000;

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing 'prompt'" });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "You are a seasoned startup mentor and venture analyst. Your role is to evaluate startup ideas based on clarity, market fit, innovation, and monetization potential.",
    });

    const result = await model.generateContent(prompt);
    const response = result.response;

    res.json({ result: response.text() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
