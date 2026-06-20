import {
  AGENT_SYSTEM_PROMPT,
  createAiClient,
  GEMINI_MODEL,
  MAX_HISTORY_MESSAGES,
  safeJsonParse,
  sendJson,
  truncateText,
} from "../../src/lib/server/latimoreAi";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  const ai = createAiClient();
  if (!ai) {
    return sendJson(res, 503, {
      error: "GEMINI_API_KEY is not configured on the server.",
    });
  }

  try {
    const message = truncateText(req.body?.message);
    const history = Array.isArray(req.body?.history) ? req.body.history.slice(-MAX_HISTORY_MESSAGES) : [];
    const fileSystem = req.body?.fileSystem ?? {};

    if (!message.trim()) {
      return sendJson(res, 400, { error: "Message is required." });
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

    return sendJson(res, 200, {
      role: "agent",
      content: typeof data.content === "string" ? data.content : "I've processed your request.",
      actions: Array.isArray(data.actions) ? data.actions : [],
      thought: typeof data.thought === "string" ? data.thought : undefined,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error("Chat Error:", error);
    return sendJson(res, 500, { error: error.message || "Copilot request failed." });
  }
}
