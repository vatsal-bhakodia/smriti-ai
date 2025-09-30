export const DEFAULT_GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
export const DEFAULT_MODEL = "gemini-2.0-flash";

type GenerateOptions = {
  model?: string;
  baseUrl?: string;
  apiKey?: string;
};

export async function generateContent(prompt: string, options: GenerateOptions = {}): Promise<string> {
  const apiKey = options.apiKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not set");
  }

  const baseUrl = options.baseUrl || process.env.NEXT_PUBLIC_GEMINI_API_BASE || DEFAULT_GEMINI_API_BASE;
  const model = options.model || process.env.NEXT_PUBLIC_GEMINI_MODEL || DEFAULT_MODEL;

  const url = `${baseUrl}/models/${model}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return String(text);
}


