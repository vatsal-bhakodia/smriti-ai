import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const resourceId = searchParams.get("resourceId");
    const format = searchParams.get("format") || "txt";

    if (!resourceId) {
      return NextResponse.json(
        { message: "resourceId is required" },
        { status: 400 }
      );
    }

    // Fetch the flashcard deck and cards
    const deck = await prisma.flashcardDeck.findUnique({
      where: { resourceId },
      include: {
        cards: true,
        resource: {
          include: {
            folder: true,
          },
        },
      },
    });

    if (
      !deck ||
      !deck.resource.folder ||
      deck.resource.folder.userId !== userId
    ) {
      return NextResponse.json(
        { message: "Flashcard deck not found or access denied" },
        { status: 404 }
      );
    }

    if (format === "txt") {
      // Export as plain text
      let content = `Flashcards for: ${deck.title}\n`;
      content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

      deck.cards.forEach((card: any, index: number) => {
        content += `${index + 1}. ${card.term}\n`;
        content += `   ${card.definition}\n\n`;
      });

      return new NextResponse(content, {
        headers: {
          "Content-Type": "text/plain",
          "Content-Disposition": `attachment; filename="${deck.title
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase()}_flashcards.txt"`,
        },
      });
    } else if (format === "anki") {
      // Export as Anki-compatible CSV (can be imported into Anki)
      let content = "term,definition\n";
      deck.cards.forEach((card: any) => {
        const term = card.term.replace(/"/g, '""');
        const definition = card.definition.replace(/"/g, '""');
        content += `"${term}","${definition}"\n`;
      });
      return new NextResponse(content, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${deck.title
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase()}_flashcards.csv"`,
        },
      });
    } else {
      return NextResponse.json(
        { message: "Unsupported format. Use 'txt' or 'anki'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error exporting flashcards:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
