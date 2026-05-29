import { GoogleGenAI } from "@google/genai";

const viteEnv = ((import.meta as any).env || {}) as Record<string, string | undefined>;
const geminiApiKey = String(viteEnv.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim();
const geminiModel = String(viteEnv.VITE_GEMINI_MODEL || 'gemini-2.5-flash').trim();

let aiClient: GoogleGenAI | null = null;

const getGeminiClient = () => {
  if (!geminiApiKey) {
    throw new Error(
      'Gemini API key is missing. Set VITE_GEMINI_API_KEY or GEMINI_API_KEY in your environment.'
    );
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  return aiClient;
};

export async function generateMarketingContent(prompt: string, type: string) {
  const response = await getGeminiClient().models.generateContent({
    model: geminiModel,
    contents: `Generate a professional marketing ${type} based on the following prompt: ${prompt}. Return the content in a clean format.`,
  });
  return response.text;
}

export async function analyzeSentiment(text: string) {
  const response = await getGeminiClient().models.generateContent({
    model: geminiModel,
    contents: `Analyze the sentiment of the following text and return a single word (Positive, Neutral, or Negative): ${text}`,
  });
  return response.text?.trim();
}

interface PersonalizationContext {
  firstName: string;
  lastName: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  pastInteractions?: string[];
  objective: string;
  additionalNotes?: string;
}

export async function generatePersonalizedEmail(context: PersonalizationContext) {
  const interactionsStr = context.pastInteractions && context.pastInteractions.length > 0
    ? context.pastInteractions.map(act => `- ${act}`).join("\n")
    : "No logged past interactions.";

  const prompt = `Draft a highly personalized CRM outreach email to a contact with the following profile:
- Dynamic/Placeholder Field: [Contact First Name] placeholder should be used, but also pre-filled with "${context.firstName}" or structured elegantly.
- Dynamic/Placeholder Field: [Company Name] placeholder should be used, but also pre-filled with "${context.company || 'their company'}" or template form.
- Full Name: ${context.firstName} ${context.lastName}
- Company: ${context.company || 'N/A'}
- Job Title: ${context.jobTitle || 'N/A'}
- Industry: ${context.industry || 'N/A'}

Campaign Objective: ${context.objective}
Past Interactions history:
${interactionsStr}

Additional Instructions/Notes: ${context.additionalNotes || 'N/A'}

Requirements:
1. Provide a professional and highly relevant subject line starting with "Subject: ".
2. The email body must contain brackets like [Contact Name] or [Company Name] as templates, but they should be fully pre-populated or customized according to the contact info, while highlighting these pieces of information clearly. Keep the structure editable.
3. Tailor the tone of the email based on their industry or job title (e.g. professional for finance/enterprise, active for marketing, technical for software).
4. Direct references to past interaction details should feel natural.
5. End with a professional sign-off with placeholders like [Your Name] and [Your Title].
6. Keep the email concise, persuasive, and under 250 words total.`;

  const response = await getGeminiClient().models.generateContent({
    model: geminiModel,
    contents: prompt,
  });

  return response.text;
}
