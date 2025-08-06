
const dotenv = require("dotenv");
dotenv.config();

// controllers/aiController.js
const Together = require("together-ai");
const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });
exports.askAI = async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ message: "Question required" });
  try {
    const completion = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo", 
      messages: [{ role: "user", content: question }],
      stream: false,
    });
    res.json({ answer: completion.choices[0].message.content });
  } catch (err) {
    console.error("Together API error:", err);
    res.status(500).json({ message: "Failed AI inference" });
  }
};
