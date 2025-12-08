import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const provider = process.env.AI_PROVIDER || "gemini";

function getAIClient() {
  //
  // --- OpenAI ---
  //
  if (provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL;

    if (!apiKey) throw new Error("OPENAI_API_KEY is required");
    if (!model) throw new Error("OPENAI_MODEL is required");

    const client = new OpenAI({ apiKey });

    return {
      provider: "openai" as const,
      model,
      instance: client,
    };
  }

  //
  // --- DeepSeek ---
  //
  if (provider === "deepseek") {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const model = process.env.DEEPSEEK_MODEL;

    if (!apiKey) throw new Error("DEEPSEEK_API_KEY is required");
    if (!model) throw new Error("DEEPSEEK_MODEL is required");

    // Uses OpenAI-compatible API
    const client = new OpenAI({
      apiKey,
      baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
    });

    return {
      provider: "deepseek" as const,
      model,
      instance: client,
    };
  }

  //
  // --- Gemini (default) ---
  //
  const geminiKey = process.env.GEMINI_API_KEY;
  const geminiModel = process.env.GEMINI_API_MODEL;

  if (!geminiKey) throw new Error("GEMINI_API_KEY is required");
  if (!geminiModel) throw new Error("GEMINI_API_MODEL is required");

  const gemini = new GoogleGenerativeAI(geminiKey);

  return {
    provider: "gemini" as const,
    model: geminiModel,
    instance: gemini.getGenerativeModel({ model: geminiModel }),
  };
}

/**
 * Process a prompt with the configured AI provider
 * @param systemPrompt - The system instruction for the AI
 * @param userPrompt - The user's actual prompt/content
 * @returns The AI's response as a string
 */
export async function processPrompt(
  systemPrompt: string,
  userPrompt: string = ""
): Promise<string> {
  const ai = getAIClient();

  try {
    //
    // --- Gemini ---
    //
    if (ai.provider === "gemini") {
      // Gemini doesn't have separate system/user roles in the same way
      // We combine them with clear separation
      const combinedPrompt = `${systemPrompt}

---

${userPrompt}`;

      const result = await ai.instance.generateContent(combinedPrompt);
      return result.response.text();
    }

    //
    // --- OpenAI & DeepSeek ---
    //
    const completion = await ai.instance.chat.completions.create({
      model: ai.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });

    return completion.choices[0].message?.content || "";
  } catch (error) {
    console.error(`${ai.provider} API Error:`, error);
    throw new Error(
      `AI service request failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
