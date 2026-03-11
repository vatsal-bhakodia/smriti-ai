import { fetchPdfText } from "@/lib/pdfParser";
import { getYoutubeTranscript } from "@/utils/youtube";
import { processPrompt } from "@/lib/processPrompt";
import { SUMMARY_PROMPTS } from "@/lib/prompts";
import prisma from "@/lib/prisma";

// ============================
// TEXT EXTRACTION
// ============================

/**
 * Extracts full text content from any resource type
 */
export async function getResourceText(resource: {
  type: string;
  url: string;
  summary?: string | null;
}): Promise<string | null> {
  try {
    switch (resource.type) {
      case "VIDEO":
        return await getYoutubeTranscript(resource.url);

      case "PDF":
        return await fetchPdfText(resource.url);

      case "TEXT":
        return resource.summary || null;

      default:
        return null;
    }
  } catch (error) {
    console.error("Failed to extract resource text:", error);
    return null;
  }
}

// ============================
// SUMMARY GENERATION
// ============================

/**
 * Generates a summary for a resource (non-streaming).
 * Tries full text extraction first, falls back to title-based generation.
 */
export async function generateSummary(resource: {
  type: string;
  url: string;
  title: string;
  summary?: string | null;
}): Promise<string> {
  let fullText: string | null = null;
  let prompt;

  try {
    fullText = await getResourceText(resource);

    if (fullText) {
      if (resource.type === "VIDEO") {
        prompt = SUMMARY_PROMPTS.fromTranscript(fullText);
      } else if (resource.type === "PDF") {
        prompt = SUMMARY_PROMPTS.fromPdfText(fullText);
      } else if (resource.type === "TEXT") {
        prompt = SUMMARY_PROMPTS.fromTranscript(fullText);
      }
    }
  } catch (error) {
    console.warn(
      `Failed to extract full text for ${resource.type}. Falling back to title-based summary.`
    );
  }

  // Fallback: generate from title if text extraction failed
  if (!prompt) {
    prompt = SUMMARY_PROMPTS.fromTitle(
      resource.title,
      resource.type as "VIDEO" | "PDF" | "TEXT"
    );
  }

  const summary = await processPrompt(prompt.system, prompt.user);
  return summary;
}

/**
 * Gets existing summary or generates a new one.
 * Caches the result in the database.
 * Returns { summary, cached } so callers know whether to stream or fake-stream.
 */
export async function getOrGenerateSummary(
  resourceId: string
): Promise<{ summary: string; cached: boolean }> {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
  });

  if (!resource) {
    throw new Error("Resource not found");
  }

  // Return existing summary if available
  if (resource.summary && resource.summary.length > 0) {
    return { summary: resource.summary, cached: true };
  }

  // Generate new summary
  const summary = await generateSummary(resource);

  // Persist for future use
  if (summary && summary.length > 0) {
    await prisma.resource.update({
      where: { id: resourceId },
      data: { summary },
    });
  }

  return { summary, cached: false };
}

/**
 * Build the summary prompt for a resource (for streaming generation).
 * Returns { system, user } prompt pair, or null if resource already has a summary.
 */
export async function getSummaryPrompt(
  resourceId: string
): Promise<{ system: string; user: string } | null> {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
  });

  if (!resource) {
    throw new Error("Resource not found");
  }

  let fullText: string | null = null;
  let prompt;

  try {
    fullText = await getResourceText(resource);

    if (fullText) {
      if (resource.type === "VIDEO") {
        prompt = SUMMARY_PROMPTS.fromTranscript(fullText);
      } else if (resource.type === "PDF") {
        prompt = SUMMARY_PROMPTS.fromPdfText(fullText);
      } else if (resource.type === "TEXT") {
        prompt = SUMMARY_PROMPTS.fromTranscript(fullText);
      }
    }
  } catch {
    // Fall through to title fallback
  }

  if (!prompt) {
    prompt = SUMMARY_PROMPTS.fromTitle(
      resource.title,
      resource.type as "VIDEO" | "PDF" | "TEXT"
    );
  }

  return prompt;
}

// ============================
// UTILITY
// ============================

/**
 * Extracts JSON array from AI response text.
 * Handles cases where AI returns markdown code blocks.
 */
export function extractJSON(text: string): any {
  let cleaned = text.trim();

  // Remove markdown code blocks if present
  cleaned = cleaned.replace(/```json\n?/g, "");
  cleaned = cleaned.replace(/```\n?/g, "");
  cleaned = cleaned.trim();

  // Try to find JSON array
  const match = cleaned.match(/\[.*\]/s);
  if (!match) {
    throw new Error("No JSON array found in AI response.");
  }

  return JSON.parse(match[0]);
}
