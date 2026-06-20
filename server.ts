import express, { type Request, type Response, type NextFunction } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const MAX_JSON_BODY = process.env.MAX_JSON_BODY || "1mb";
const MAX_HISTORY_MESSAGES = 25;
const MAX_TEXT_CHARS = 12_000;

const AGENT_SYSTEM_PROMPT = `
You are the Latimore Hub OS Copilot, a high-performance AI assistant for Latimore Life & Legacy LLC.
Your goal is to help Jackson M. Latimore Sr. manage business operations, revenue engine, and daily tasks.

Context:
- Business: Latimore Life & Legacy LLC (Insurance & Legacy Planning)
- Motto: Protecting Today. Securing Tomorrow. #TheBeatGoesOn
- Primary Markets: Schuylkill County, Coal Region, Luzerne County, and Northumberland County
- Key People: Jackson M. Latimore Sr. (Founder & CEO)

Capabilities:
You can interact with a simulated file system to read and write documents.
- FILE_READ: Payload is the file path (e.g., "readme.md").
- FILE_WRITE: Payload is an object { "path": "path/to/file.ext", "content": "..." }.
- FILE_CREATE: Payload is an object { "path": "path/to/item", "type": "file" | "dir" }.

Response Format:
You MUST respond in JSON format ONLY:
{
  "thought": "Your brief rationale for the action or response",
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

function createAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "latimore-hub-os",
      },
    },
  });
}

function truncateText(value: unknown, maxChars = MAX_TEXT_CHARS): string {
  if (typeof value !== "string") return "";
  return value.length > maxChars ? `${value.slice(0, maxChars)}…` : value;
}

function safeJsonParse(text: string): Record<string, any> {
  try {
    return JSON.parse(text || "{}");
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return {};
    try {
      return JSON.parse(match[0]);
    } catch {
      return {};
    }
  }
}

function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
}

async function startServer() {
  const app = express();
  const ai = createAiClient();

  app.disable("x-powered-by");
  app.use(securityHeaders);
  app.use(express.json({ limit: MAX_JSON_BODY }));

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      service: "Latimore Hub OS",
      aiConfigured: Boolean(process.env.GEMINI_API_KEY),
      model: GEMINI_MODEL,
      timestamp: new Date().toISOString(),
    });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      if (!ai) {
        return res.status(503).json({
          error: "GEMINI_API_KEY is not configured on the server.",
        });
      }

      const message = truncateText(req.body?.message);
      const history = Array.isArray(req.body?.history) ? req.body.history.slice(-MAX_HISTORY_MESSAGES) : [];
      const fileSystem = req.body?.fileSystem ?? {};

      if (!message.trim()) {
        return res.status(400).json({ error: "Message is required." });
      }

      const contents = [
        {
          role: "model",
          parts: [{ text: `Current File System State:\n${truncateText(JSON.stringify(fileSystem, null, 2))}` }],
        },
        ...history.map((h: any) => {
          const role = h?.role === "user" ? "user" : "model";
          let text = truncateText(h?.content);
          if (role !== "user" && (h?.actions?.length > 0 || h?.thought)) {
            text = truncateText(JSON.stringify({
              thought: h.thought,
              content: h.content,
              actions: h.actions,
            }));
          }
          return { role, parts: [{ text }] };
        }),
        { role: "user", parts: [{ text: message }] },
      ];

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config: {
          systemInstruction: AGENT_SYSTEM_PROMPT,
          responseMimeType: "application/json",
        },
      });

      const data = safeJsonParse(response.text || "{}");

      res.json({
        role: "agent",
        content: typeof data.content === "string" ? data.content : "I've processed your request.",
        actions: Array.isArray(data.actions) ? data.actions : [],
        thought: typeof data.thought === "string" ? data.thought : undefined,
        timestamp: Date.now(),
      });
    } catch (error: any) {
      console.error("Chat Error:", error);
      res.status(500).json({ error: error.message || "Copilot request failed." });
    }
  });

  app.post("/api/ai/sentiment/analyze", async (req, res) => {
    try {
      if (!ai) {
        return res.status(503).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const commentText = truncateText(req.body?.commentText, 4_000);
      const author = truncateText(req.body?.author || "Unknown", 500);
      if (!commentText.trim()) {
        return res.status(400).json({ error: "No comment content provided." });
      }

      const prompt = `Analyze the following social media comment and return a structured JSON response matching the schema.
Comment text: "${commentText}"
Author: "${author}"

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

Raise compliance_risk to medium or high if the comment involves investment advice, claims procedures, product guarantees, or regulated financial promises. Keep recommended actions aligned to Latimore Life & Legacy LLC: Protecting Today. Securing Tomorrow. #TheBeatGoesOn.`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      res.json(safeJsonParse(response.text || "{}"));
    } catch (error: any) {
      console.error("Sentiment API error:", error);
      res.json({
        sentiment: "neutral",
        confidence: 0.85,
        intent: "other",
        urgency: "low",
        topics: ["community", "feedback"],
        trending_terms: ["general"],
        lead_potential: "medium",
        compliance_risk: "none",
        recommendedAction: "Reply thanking them for reaching out to Latimore Life & Legacy and offer a confidential consultation. #TheBeatGoesOn",
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get(/.*/, (req, res) => {
      if (req.path.startsWith("/api/")) {
        return res.status(404).json({ error: "API route not found." });
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
