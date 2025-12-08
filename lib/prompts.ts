// ============================
// SYSTEM PROMPTS
// ============================

export const SYSTEM_PROMPTS = {
  LEARNING_ASSISTANT:
    "You are a helpful learning assistant. Be concise, precise, and educational.",
  STUDY_COACH:
    "You are an expert study coach who creates clear, actionable learning paths.",
  TUTOR:
    "You are an expert tutor who provides clear, concise answers based on provided context.",
  QUIZ_GENERATOR:
    "You are an AI quiz generator that creates challenging, fair multiple-choice questions.",
  FLASHCARD_GENERATOR:
    "You are an AI flashcard generator that extracts key concepts into memorable term-definition pairs.",
  MINDMAP_GENERATOR:
    "You are an AI that generates structured mind maps using mermaid.js syntax.",
};

// ============================
// SUMMARY GENERATION
// ============================

export const SUMMARY_PROMPTS = {
  fromTranscript: (transcript: string) => ({
    system: SYSTEM_PROMPTS.LEARNING_ASSISTANT,
    user: `Read the following transcript and generate a concise, informative summary.

Include:
1. A 3-5 sentence high-level overview of the topic and purpose
2. 5-10 bullet points highlighting key concepts, terms, or steps
3. Rewrite everything in your own words (no verbatim phrases)
4. Exclude timestamps, speaker names, and filler content

Transcript:
${transcript}`,
  }),

  fromPdfText: (text: string) => ({
    system: SYSTEM_PROMPTS.LEARNING_ASSISTANT,
    user: `Read the following PDF text and generate a concise, informative summary.

Include:
1. A 3-5 sentence high-level overview of the topic and purpose
2. 5-10 bullet points highlighting key concepts, terms, or steps
3. Rewrite everything in your own words (no verbatim phrases)
4. Ignore metadata, headers, page numbers, and filler content

PDF Text:
${text}`,
  }),

  fromTitle: (title: string, type: "VIDEO" | "PDF" | "ARTICLE") => ({
    system: SYSTEM_PROMPTS.LEARNING_ASSISTANT,
    user: `Based on the ${type.toLowerCase()} titled "${title}", write a detailed, well-structured summary.

Explain the core concepts, key takeaways, and important principles clearly and confidently.
Avoid vague phrases like "might..." or "seems to...".
Make it informative enough to support mind maps, roadmaps, and quiz generation.`,
  }),
};

// ============================
// ROADMAP GENERATION
// ============================

export const ROADMAP_PROMPT = (summary: string) => ({
  system: SYSTEM_PROMPTS.STUDY_COACH,
  user: `Based on this summary, generate a detailed learning roadmap.

Include:
1. Sequential learning milestones or modules
2. Suggested time durations (e.g., Day 1-2: Basics, Day 3-5: Practice)
3. Optional resources or exercises for each section
4. Tips for mastering concepts and common pitfalls to avoid
5. Make it easy to follow and suitable for self-paced learning

Summary:
${summary}`,
});

// ============================
// Q&A WITH CONTEXT
// ============================

export const QA_PROMPTS = {
  withContext: (context: string, question: string) => ({
    system: SYSTEM_PROMPTS.TUTOR,
    user: `Use ONLY the provided context to answer the question.
Keep the answer concise (2-5 sentences).
If the context is insufficient, say you cannot find the answer.

Context:
${context}

Question:
${question}`,
  }),

  withSummary: (summary: string, question: string) => ({
    system: SYSTEM_PROMPTS.TUTOR,
    user: `Answer the question based on this summary.

Provide a clear, concise answer in 2-5 sentences.
If not directly available, use reasoning to infer the best answer.
Be specific and educational. Answer directly without preamble.

Summary:
${summary}

Question:
${question}`,
  }),
};

// ============================
// MINDMAP GENERATION
// ============================

export const MINDMAP_PROMPT = (summary: string) => ({
  system: SYSTEM_PROMPTS.MINDMAP_GENERATOR,
  user: `Generate a clear, organized mind map from this summary.

Rules:
1. Use mermaid.js 'graph TD' format
2. Start from a central topic node and branch into key concepts
3. Sub-branches should cover details, processes, relationships, or definitions
4. Use 6-12 nodes maximum for clarity
5. DO NOT use emojis or special characters (α, β, ∑, ₹, etc.) - use plain English words
6. DO NOT use numbers - use words like "one", "two", etc.

Summary:
${summary}`,
});

// ============================
// QUIZ GENERATION
// ============================

export const QUIZ_PROMPT = (summary: string) => ({
  system: SYSTEM_PROMPTS.QUIZ_GENERATOR,
  user: `Generate 10-15 multiple-choice questions from this summary.

Each question must have:
- "question": a clear, well-structured question
- "options": array of exactly 4 plausible options
- "correctAnswer": the correct option as a string
- "explanation": brief 1-2 sentence justification
- "difficulty": 'Easy', 'Medium', or 'Hard'

Rules:
- Return ONLY a valid JSON array (no markdown, no extra text)
- Focus on comprehension and application, not memorization
- Avoid overly easy or irrelevant questions

Example format:
[
  {
    "question": "What is 2 + 2?",
    "options": ["1", "2", "3", "4"],
    "correctAnswer": "4",
    "explanation": "2 + 2 equals 4.",
    "difficulty": "Easy"
  }
]

Summary:
${summary}`,
});

// ============================
// FLASHCARD GENERATION
// ============================

export const FLASHCARD_PROMPT = (summary: string) => ({
  system: SYSTEM_PROMPTS.FLASHCARD_GENERATOR,
  user: `Create 10-15 flashcards covering the most important concepts.

Each flashcard must include:
- "term": a clear, concise concept name
- "definition": a detailed but concise explanation

Rules:
- Focus on key concepts, definitions, processes, and important facts
- Make terms specific and memorable
- Keep definitions clear and educational
- Return ONLY a valid JSON array (no markdown, no extra text)

Example format:
[
  {
    "term": "Photosynthesis",
    "definition": "The process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen."
  }
]

Summary:
${summary}`,
});

export const SUMMARY_PROMPT_PDF = (text: string) => `
You are a helpful learning assistant. Read the following extracted PDF text and generate a concise and informative summary.

Please include:
1. A 3-5 sentence high-level summary explaining the overall topic and purpose.
2. 5-10 bullet points that highlight the most important concepts, terms, or steps discussed.
3. Avoid repeating phrases verbatim from the PDF; rewrite in your own words.
4. Ignore metadata, headers, page numbers, or irrelevant filler content.

PDF Text:
${text}
`;
