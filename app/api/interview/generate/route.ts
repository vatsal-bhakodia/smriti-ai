import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { generateContent as geminiGenerate } from "@/lib/gemini-rest";

type GeneratedMCQ = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty?: string;
};

async function askGeminiForMCQs(
  language: string,
  domain: string,
  count: number
): Promise<GeneratedMCQ[]> {
  const prompt = [
    "You are an expert interviewer.",
    `Create ${count} high-quality multiple-choice questions for ${language} in the domain of ${domain}.`,
    "Return STRICT JSON array only. Each item must have keys: question, options (exactly 4), correctAnswer (exact string from options), explanation (<=200 chars), difficulty (Easy|Medium|Hard).",
    "Example: [ { \"question\": \"...\", \"options\": [\"A\",\"B\",\"C\",\"D\"], \"correctAnswer\": \"A\", \"explanation\": \"...\", \"difficulty\": \"Medium\" } ]",
  ].join("\n");

  const text = await geminiGenerate(prompt, { model: "gemini-2.0-flash" });
  const match = text.match(/\[[\s\S]*\]/);
  const json = JSON.parse(match ? match[0] : text);
  if (!Array.isArray(json)) return [];
  return json.slice(0, count) as GeneratedMCQ[];
}

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { language, domain, domains, count = 10 } = await req.json();
    if (!language || (!domain && (!domains || !Array.isArray(domains) || domains.length === 0))) {
      return NextResponse.json({ message: "language and domain(s) are required" }, { status: 400 });
    }
    const selectedDomains: string[] = (Array.isArray(domains) ? domains : [domain]).filter(Boolean);

    const joinedDomain = selectedDomains.join(", ");
    const items = await askGeminiForMCQs(String(language), joinedDomain, Number(count));
    if (!items.length)
      return NextResponse.json({ message: "Failed to generate questions" }, { status: 502 });

    const quiz = await (prisma as any).interviewQuiz.create({
      data: {
        userId,
        language: String(language),
        domain: joinedDomain || selectedDomains[0] || "",
        questions: {
          create: items.map((q: GeneratedMCQ) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation ?? null,
            difficulty: q.difficulty ?? "Medium",
          })),
        },
      },
      include: { questions: true },
    });

    const sanitizedQuestions = (quiz.questions as Array<{ id: string; question: string; options: string[]; difficulty?: string }>).map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
    }));

    return NextResponse.json({
      quizId: quiz.id,
      language: quiz.language,
      domain: quiz.domain,
      createdAt: quiz.createdAt,
      questions: sanitizedQuestions,
    });
  } catch (e) {
    console.error("[INTERVIEW_GENERATE]", e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}


