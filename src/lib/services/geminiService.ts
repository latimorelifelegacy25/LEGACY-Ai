
import { Message } from "../../../types";

export const chatWithCopilot = async (message: string, history: Message[], fileSystem: any): Promise<Message> => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      message, 
      history: history.map(h => ({ 
        role: h.role, 
        content: h.content,
        thought: h.thought,
        actions: h.actions
      })),
      fileSystem
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to communicate with Copilot");
  }

  return await response.json();
};
