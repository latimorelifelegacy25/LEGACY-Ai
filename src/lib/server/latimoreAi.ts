import { GoogleGenAI } from "@google/genai";

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
export const MAX_HISTORY_MESSAGES = 25;
export const MAX_TEXT_CHARS = 12_000;

export const AGENT_SYSTEM_PROMPT = `
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

export function createAiClient(): GoogleGenAI | null {
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

export function truncateText(value: unknown, maxChars = MAX_TEXT_CHARS): string {
  if (typeof value !== "string") return "";
  return value.length > maxChars ? `${value.slice(0, maxChars)}…` : value;
}

export function safeJsonParse(text: string): Record<string, any> {
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

export function setJsonHeaders(res: any): void {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
}

export function sendJson(res: any, statusCode: number, payload: Record<string, unknown>): void {
  setJsonHeaders(res);
  res.status(statusCode).json(payload);
}
