import { fetchPdfText } from "@/lib/pdfParser";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { getYoutubeTranscript } from "@/utils/youtube";
import { processPrompt } from "@/lib/processPrompt";
import { SUMMARY_PROMPTS } from "@/lib/prompts";
import prisma from "@/lib/prisma";
import type { Embeddings } from "@langchain/core/embeddings";

const SUPABASE_TABLE = process.env.SUPABASE_VECTOR_TABLE || "documents";
const SUPABASE_QUERY_NAME =
  process.env.SUPABASE_VECTOR_QUERY || "match_documents";

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
 * Generates a summary for a resource
 * Tries full text extraction first, falls back to title-based generation
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
    // Try to get full text first
    fullText = await getResourceText(resource);

    if (fullText) {
      // Generate summary from full text
      if (resource.type === "VIDEO") {
        prompt = SUMMARY_PROMPTS.fromTranscript(fullText);
      } else if (resource.type === "PDF") {
        prompt = SUMMARY_PROMPTS.fromPdfText(fullText);
      } else if (resource.type === "TEXT") {
        prompt = SUMMARY_PROMPTS.fromTranscript(fullText); // Treat as transcript
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
 * Gets existing summary or generates a new one
 * Caches the result in the database
 */
export async function getOrGenerateSummary(
  resourceId: string
): Promise<string> {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
  });

  if (!resource) {
    throw new Error("Resource not found");
  }

  // Return existing summary if available
  if (resource.summary && resource.summary.length > 0) {
    return resource.summary;
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

  return summary;
}

// ============================
// CONTEXTUAL RETRIEVAL (RAG)
// ============================

/**
 * Gets the appropriate embeddings instance based on AI_PROVIDER env variable
 * Follows the same pattern as processPrompt.ts
 */
function getEmbeddings(): Embeddings {
  const provider = process.env.AI_PROVIDER || "gemini";

  // --- OpenAI ---
  if (provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is required for OpenAI embeddings");
    }

    return new OpenAIEmbeddings({
      openAIApiKey: apiKey,
      modelName: process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small",
    });
  }

  // --- DeepSeek ---
  if (provider === "deepseek") {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error("DEEPSEEK_API_KEY is required for DeepSeek embeddings");
    }

    // DeepSeek uses OpenAI-compatible API, so we use OpenAIEmbeddings with custom configuration
    return new OpenAIEmbeddings({
      openAIApiKey: apiKey,
      modelName: process.env.DEEPSEEK_EMBED_MODEL || "text-embedding-3-small",
      configuration: {
        baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
      },
    });
  }

  // --- Gemini (default) ---
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    throw new Error("GEMINI_API_KEY is required for Gemini embeddings");
  }

  return new GoogleGenerativeAIEmbeddings({
    apiKey: geminiKey,
    model: process.env.GEMINI_EMBED_MODEL || "text-embedding-004",
  });
}

/**
 * Builds contextual snippets using RAG (Retrieval Augmented Generation)
 * Splits text into chunks, creates embeddings, and finds most relevant chunks
 * Uses the AI provider specified in process.env.AI_PROVIDER
 */
export async function buildContextualSnippet(
  text: string,
  question: string,
  resourceId: string
): Promise<string> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1200,
    chunkOverlap: 200,
  });
  const docs = await splitter.createDocuments([text], [{ resourceId }]);

  // Get embeddings based on AI_PROVIDER env variable
  const embeddings = getEmbeddings();

  let relevant;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Prefer persisted vectors in Supabase when configured
  if (supabaseUrl && supabaseKey) {
    try {
      const client = createClient(supabaseUrl, supabaseKey);
      const store = await SupabaseVectorStore.fromDocuments(docs, embeddings, {
        client,
        tableName: SUPABASE_TABLE,
        queryName: SUPABASE_QUERY_NAME,
      });
      relevant = await store.similaritySearch(question, 4);
    } catch (err) {
      console.warn(
        "Supabase vector search failed; falling back to in-memory store.",
        err
      );
    }
  }

  if (!relevant) {
    return "";
  }

  return relevant
    .map((d: { pageContent: string }) => d.pageContent)
    .join("\n---\n");
}

// ============================
// UTILITY
// ============================

/**
 * Extracts JSON array from AI response text
 * Handles cases where AI returns markdown code blocks
 */
export function extractJSON(text: string): any {
  // Remove markdown code blocks if present
  let cleaned = text.trim();

  // Remove ```json and ``` markers
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
