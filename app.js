import express from "express";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const MarkdownIt = require("markdown-it");
const md = new MarkdownIt();

const apiKey = "AIzaSyCmOCFd-sZa0QFyOWMH8LlEYqrW_xMLUbY";

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "This is an app for summarizing notes. Your role is to summarize the text or image that is given. Your response should be used for notes. Format your output appropriately.",
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.post("/gemini-api", async (req, res) => {
  const { prompt } = req.body;
  const result = await model.generateContent(prompt);

  res.json({ response: md.render(result.response.text()) });
});

app.listen(3000, () => {
  console.log("Server running at localhost:3000");
});
