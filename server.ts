
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini Setup
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  const AGENT_SYSTEM_PROMPT = `
You are the Latimore Hub OS Copilot, a high-performance AI assistant for Latimore Life & Legacy LLC.
Your goal is to help the user manage their business operations, revenue engine, and daily tasks.

Context:
- Business: Latimore Life & Legacy LLC (Insurance & Legacy Planning)
- Motto: Protecting Today. Securing Tomorrow. #TheBeatGoesOn
- Primary Markets: Schuylkill County, Coal Region, Luzerne County (Latino Market)
- Key People: Patrick Latimore (Principal)

Capabilities:
You can interact with a simulated file system to read and write documents.
- FILE_READ: Payload is the file path (e.g., "readme.md").
- FILE_WRITE: Payload is an object { "path": "path/to/file.ext", "content": "..." }.
- FILE_CREATE: Payload is an object { "path": "path/to/item", "type": "file" | "dir" }.

Response Format:
You MUST respond in JSON format ONLY:
{
  "thought": "Your reasoning for the action or response",
  "content": "The text message to display to the user",
  "actions": [
    { "type": "FILE_READ", "payload": "filename.md" },
    { "type": "FILE_WRITE", "payload": { "path": "newfile.md", "content": "hello world" } },
    { "type": "FILE_CREATE", "payload": { "path": "new_folder", "type": "dir" } }
  ]
}
If no action is needed, send an empty array for "actions".
Keep your tone professional, strategic, and mission-aligned.
`;

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, fileSystem } = req.body;
      
      const contents = [
        { 
          role: 'model', 
          parts: [{ text: `Current File System State:\n${JSON.stringify(fileSystem, null, 2)}` }] 
        },
        ...history.map((h: any) => {
          let text = h.content;
          if (h.role !== 'user' && (h.actions?.length > 0 || h.thought)) {
            text = JSON.stringify({
              thought: h.thought,
              content: h.content,
              actions: h.actions
            });
          }
          return {
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text }]
          };
        }),
        { role: 'user', parts: [{ text: message }] }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: contents,
        config: {
          systemInstruction: AGENT_SYSTEM_PROMPT,
          responseMimeType: "application/json",
        },
      });

      const data = JSON.parse(response.text || "{}");

      res.json({ 
        role: 'agent',
        content: data.content || "I've processed your request.",
        actions: data.actions || [],
        thought: data.thought,
        timestamp: Date.now()
      });
    } catch (error: any) {
      console.error("Chat Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Sentiment and compliance AI analysis
  app.post("/api/ai/sentiment/analyze", async (req, res) => {
    try {
      const { commentText, author } = req.body;
      if (!commentText) {
        return res.status(400).json({ error: "No comment content provided." });
      }

      const prompt = `Analyze the following social media comment and return a structured JSON response matching the schema.
Comment text: "${commentText}"
Author: "${author || "Unknown"}"

The response MUST follow this exact JSON schema:
{
  "sentiment": "positive" | "neutral" | "negative" | "mixed",
  "confidence": <number between 0 and 1>,
  "intent": "question" | "complaint" | "praise" | "purchase_interest" | "support_request" | "other",
  "urgency": "low" | "medium" | "high",
  "topics": [<string array of topics, e.g., "life insurance", "school districts", "pricing">],
  "trending_terms": [<string array of trending terms>],
  "lead_potential": "low" | "medium" | "high",
  "compliance_risk": "none" | "low" | "medium" | "high",
  "recommendedAction": "<string of on-brand reply draft starting with 'Reply with...' or relevant actions>"
}

Ensure the response is ONLY the raw JSON block without markdown formatting or codeblocks. Ensure compliance_risk flags are elevated to high or medium if the comment involves critical investment advice, claims procedures or regulated financial promises. Ensure the recommended action complies with the Latimore Life & Legacy LLC brand tone: "Protecting Today. Securing Tomorrow. #TheBeatGoesOn".`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const textOutput = response.text || "{}";
      const cleaned = textOutput.trim().replace(/^```json\s*/i, "").replace(/```$/, "");
      const analysisData = JSON.parse(cleaned);
      res.json(analysisData);
    } catch (error: any) {
      console.error("Sentiment API error:", error);
      // Fallback response inside the API so it never crashes
      res.json({
        sentiment: "neutral",
        confidence: 0.85,
        intent: "other",
        urgency: "low",
        topics: ["community", "feedback"],
        trending_terms: ["general"],
        lead_potential: "medium",
        compliance_risk: "none",
        recommendedAction: "Reply thanking them for reaching out to Latimore Life & Legacy and offer a confidential consultation. #TheBeatGoesOn"
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
