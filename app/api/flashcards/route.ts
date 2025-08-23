import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Parse and validate input
  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
  const { type, input, fileName } = (data as Record<string, unknown>) ?? {};
  if (
    typeof type !== "string" ||
    !["pdf", "text", "youtube"].includes(type) ||
    (type === "pdf" ? typeof fileName !== "string" : typeof input !== "string")
  ) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }
  // TODO: Integrate with AI summarization and flashcard generation
  // For now, return mock flashcards
  return NextResponse.json({
    deck: [
      { term: 'AI', definition: 'Artificial Intelligence' },
      { term: 'Flashcard', definition: 'A card with a question on one side and answer on the other.' }
    ]
  });
}
