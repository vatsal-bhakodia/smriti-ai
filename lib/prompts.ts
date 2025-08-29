export const FALLBACK_PROMPT = (title: string) => `
You are a smart learning assistant that helps users understand educational content.

Based on the YouTube video titled "${title}", write a detailed and well-structured summary as if you had watched the entire video.
Do not generate a video script or describe any scenes or sequences. Instead, explain the core concepts, key takeaways, and important
steps or principles in a clear, concise, and educational manner.

Avoid vague phrases like "this video might..." or "the video seems to...". Present the information confidently, as if you had full knowledge of the topic covered.

The summary should be informative and deep enough to support further tasks such as generating mind maps, creating roadmaps, or making quiz questions based on the content.
`;

export const SUMMARY_PROMPT = (transcript: string) => `
You are a helpful learning assistant. Read the following YouTube transcript and generate a concise and informative summary.

Please include:
1. A 3-5 sentence high-level summary explaining the overall topic and purpose.
2. 5-10 bullet points that highlight the most important concepts, terms, or steps discussed.
3. Avoid repeating any phrases from the transcript verbatim; rewrite in your own words.
4. Do not include timestamps, speaker names, or irrelevant filler content.

Transcript:
${transcript}
`;

export const ROADMAP_PROMPT = (summary: string) => `
You are an expert study coach. Based on the provided summary of a YouTube lesson, generate a detailed learning roadmap for a student.

The roadmap should include:
1. Sequential learning milestones or modules.
2. Suggested time durations or phases (e.g., Day 1-2: Basics, Day 3-5: Practice, etc.)
3. Optional resources or exercises that could reinforce each section.
4. Tips for mastering the concepts, common pitfalls to avoid, and when to revise.
5. The roadmap should be easy to follow and suitable for self-paced learning.

Summary:
${summary}
`;

export const QA_PROMPT = (summary: string, question: string) => `
You are an expert tutor. Answer the student's question based strictly on the following summary of a YouTube transcript.

Instructions:
1. Provide a clear and concise answer in 2-5 sentences.
2. If the answer is not directly available, use your reasoning to give the best inferred answer.
3. Avoid vague language—be as specific and educational as possible.
4. Do not include "Based on the summary..." in your response—just answer directly.

Summary:
${summary}

Question:
${question}
`;

export const MINDMAP_PROMPT = (summary: string) => `
You are an AI that generates structured mind maps using mermaid.js syntax.

Using the following summary of a YouTube transcript, generate a clear and organized mind map with the following rules:
1. Use mermaid.js 'graph TD' format.
2. Start from a central topic node and branch into key concepts.
3. Sub-branches should cover details, processes, relationships, or definitions.
4. Use 6-12 nodes maximum for clarity.
5. DO NOT use emojis or special characters (e.g., α, β, ∑, ₹, etc.). Use plain English words like "alpha", "beta", etc.
6. DO NOT use numbers. Use plain english words like "one", "two", etc.

Summary:
${summary}
`;

// CHANGE: This is YOUR version of QUIZ_PROMPT, which is essential for the adaptive quiz.
export const QUIZ_PROMPT = (summary: string) => `
Based on the following summary, generate up to 15 multiple-choice questions. Each question must have:
- a "question" key.
- an "options" key with an array of exactly 4 plausible options.
- a "correctAnswer" key with the correct option as a string.
- an "explanation" key with a brief 1-2 sentence explanation that justifies the correct answer.
- a "difficulty" key with a value of 'Easy', 'Medium', or 'Hard'.

Rules:
- Do NOT include introductory or closing text.
- Return ONLY a valid JSON array (no markdown, no text outside the array).
- Avoid overly easy or irrelevant questions—focus on comprehension and application.

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
${summary}
`;

// CHANGE: Added new FLASHCARD_PROMPT from the original repo.
export const FLASHCARD_PROMPT = (summary: string) => `
You are an AI flashcard generator. Based on the summary below, create 10-15 flashcards in Term → Definition format that cover the most important concepts, definitions, and key points.

Each flashcard must include:
- "term": a clear, concise term or concept name.
- "definition": a detailed but concise explanation of the term.

Rules:
- Focus on key concepts, definitions, processes, and important facts.
- Make terms specific and memorable.
- Keep definitions clear and educational.
- Do NOT include introductory or closing text.
- Return ONLY a valid JSON array (no markdown, no text outside the array).
- Avoid overly complex terms or definitions.

Example format:
[
  {
    "term": "Photosynthesis",
    "definition": "The process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen."
  },
  {
    "term": "Mitochondria",
    "definition": "Organelles in cells that produce energy through cellular respiration."
  }
]

Summary:
${summary}
`;

// CHANGE: Added all new PDF-specific prompts from the original repo.
export const FALLBACK_PROMPT_PDF = (title: string) => `
You are a smart learning assistant that helps users understand educational content.

Based on the PDF document titled "${title}", write a detailed and well-structured summary as if you had read the entire document.
Do not generate filler text or guesswork. Instead, explain the core concepts, key takeaways, and important
steps or principles in a clear, concise, and educational manner.

Avoid vague phrases like "this PDF might..." or "it seems that...". Present the information confidently, as if you had full knowledge of the text.

The summary should be informative and deep enough to support further tasks such as generating mind maps, creating roadmaps, or making quiz questions based on the content.
`;

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

export const ROADMAP_PROMPT_PDF = (summary: string) => `
You are an expert study coach. Based on the provided summary of a PDF, generate a detailed learning roadmap for a student.

The roadmap should include:
1. Sequential learning milestones or modules.
2. Suggested time durations or phases (e.g., Day 1-2: Basics, Day 3-5: Practice, etc.)
3. Optional resources or exercises that could reinforce each section.
4. Tips for mastering the concepts, common pitfalls to avoid, and when to revise.
5. The roadmap should be easy to follow and suitable for self-paced learning.

Summary:
${summary}
`;

export const QA_PROMPT_PDF = (summary: string, question: string) => `
You are an expert tutor. Answer the student's question based strictly on the following summary of a PDF.

Instructions:
1. Provide a clear and concise answer in 2-5 sentences.
2. If the answer is not directly available, use your reasoning to give the best inferred answer.
3. Avoid vague language—be as specific and educational as possible.
4. Do not include "Based on the summary..." in your response—just answer directly.

Summary:
${summary}

Question:
${question}
`;

export const MINDMAP_PROMPT_PDF = (summary: string) => `
You are an AI that generates structured mind maps using mermaid.js syntax.

Using the following summary of a PDF, generate a clear and organized mind map with the following rules:
1. Use mermaid.js 'graph TD' format.
2. Start from a central topic node and branch into key concepts.
3. Sub-branches should cover details, processes, relationships, or definitions.
4. Use 6-12 nodes maximum for clarity.
5. DO NOT use emojis or special characters (e.g., α, β, ∑, ₹, etc.). Use plain English words like "alpha", "beta", etc.
6. DO NOT use numbers. Use plain english words like "one", "two", etc.

Summary:
${summary}
`;

export const QUIZ_PROMPT_PDF = (summary: string) => `
You are an AI quiz generator. Based on the summary below (from a PDF), create 5 multiple choice questions (MCQs) that test understanding of the key concepts.

Each MCQ must include:
- "question": a well-structured, clear question.
- "options": an array of exactly 4 plausible options.
- "answer": the correct option from the list.
- "explanation": a brief 1-2 sentence explanation that justifies the correct answer.

Rules:
- Do NOT include introductory or closing text.
- Return ONLY a valid JSON array (no markdown, no text outside the array).
- Avoid overly easy or irrelevant questions—focus on comprehension and application.

Summary:
${summary}
`;

export const FLASHCARD_PROMPT_PDF = (summary: string) => `
You are an AI flashcard generator. Based on the summary below (from a PDF), create 10-15 flashcards in Term → Definition format that cover the most important concepts, definitions, and key points.

Each flashcard must include:
- "term": a clear, concise term or concept name.
- "definition": a detailed but concise explanation of the term.

Rules:
- Focus on key concepts, definitions, processes, and important facts.
- Make terms specific and memorable.
- Keep definitions clear and educational.
- Do NOT include introductory or closing text.
- Return ONLY a valid JSON array (no markdown, no text outside the array).
- Avoid overly complex terms or definitions.

Summary:
${summary}
`;