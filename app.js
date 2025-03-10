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
    "This is a brainstorming app for generating ideas related to the prompt. Your role is to generate ideas from the keywords given or if they gave a project plan, your job is to refine it only. If any of the prompts are unrelated to idea generation, respond that prompts should be related to brainstorming or idea generation",
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
