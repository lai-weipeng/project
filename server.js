import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/chatgpt", async (req, res) => {
  try {
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI API 錯誤:", errorText);
      return res.status(500).json({ error: "OpenAI API 錯誤", details: errorText });
    }

    const data = await openaiResponse.json();
    res.json(data);
  } catch (err) {
    console.error("伺服器錯誤:", err);
    res.status(500).json({ error: "伺服器內部錯誤", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
