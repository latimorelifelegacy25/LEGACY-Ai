import { GEMINI_MODEL, sendJson } from "../../src/lib/server/latimoreAi";

export default function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  return sendJson(res, 200, {
    ok: true,
    service: "Latimore Hub OS",
    runtime: "vercel-serverless",
    aiConfigured: Boolean(process.env["GEMINI_API_KEY"]),
    model: GEMINI_MODEL,
    timestamp: new Date().toISOString(),
  });
}
