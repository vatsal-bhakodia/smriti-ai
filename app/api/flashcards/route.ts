import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Parse input
  const data = await req.json();
  // TODO: Integrate with AI summarization and flashcard generation
  // For now, return mock flashcards
  return NextResponse.json({
    deck: [
      { term: 'AI', definition: 'Artificial Intelligence' },
      { term: 'Flashcard', definition: 'A card with a question on one side and answer on the other.' }
    ]
  });
}
