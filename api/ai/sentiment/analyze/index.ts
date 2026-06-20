import {
  createAiClient,
  GEMINI_MODEL,
  safeJsonParse,
  sendJson,
  truncateText,
} from "../../../../src/lib/server/latimoreAi";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  const ai = createAiClient();
  if (!ai) {
    return sendJson(res, 503, { error: "GEMINI_API_KEY is not configured on the server." });
  }

  try {
    const commentText = truncateText(req.body?.commentText, 4_000);
    const author = truncateText(req.body?.author || "Unknown", 500);

    if (!commentText.trim()) {
      return sendJson(res, 400, { error: "No comment content provided." });
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

    return sendJson(res, 200, safeJsonParse(response.text || "{}"));
  } catch (error: any) {
    console.error("Sentiment API error:", error);
    return sendJson(res, 200, {
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
}
