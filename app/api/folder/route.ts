import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

// GET: Get folder by ID or list all folders for the user
export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    // THE FIX: Re-introduced the logic to handle fetching a single folder by ID.
    if (id) {
      const folder = await prisma.folder.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!folder) {
        return NextResponse.json(
          { message: "Folder not found" },
          { status: 404 }
        );
      }
      // This now returns the expected { folder: { ... } } structure.
      return NextResponse.json({ folder });
    } else {
      // This is the new logic for fetching all folders with their progress.
      const folders = await prisma.folder.findMany({
        where: { userId },
        include: {
          resources: {
            select: { id: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const allResourceIds = folders.flatMap((t) =>
        t.resources.map((r) => r.id)
      );
      const latestQuizResults = await prisma.quizResult.findMany({
        where: {
          userId,
          quiz: {
            resourceId: { in: allResourceIds },
          },
        },
        orderBy: { createdAt: "desc" },
        distinct: ["quizId"],
        select: {
          score: true,
          totalQuestions: true,
          quiz: {
            select: { resourceId: true },
          },
        },
      });

      const resultsMap = new Map<string, { score: number; total: number }>();
      latestQuizResults.forEach((r) => {
        if (r.quiz.resourceId) {
          resultsMap.set(r.quiz.resourceId, {
            score: r.score,
            total: r.totalQuestions,
          });
        }
      });

      const foldersWithProgress = folders.map((folder) => {
        const totalResources = folder.resources.length;
        if (totalResources === 0) {
          return { ...folder, completionPercentage: 0, averageScore: 0 };
        }

        let attemptedResourcesCount = 0;
        let totalScorePercentage = 0;

        folder.resources.forEach((resource) => {
          if (resultsMap.has(resource.id)) {
            attemptedResourcesCount++;
            const result = resultsMap.get(resource.id)!;
            if (result.total > 0) {
              totalScorePercentage += (result.score / result.total) * 100;
            }
          }
        });

        const completionPercentage =
          (attemptedResourcesCount / totalResources) * 100;
        const averageScore =
          attemptedResourcesCount > 0
            ? totalScorePercentage / attemptedResourcesCount
            : 0;

        return {
          id: folder.id,
          title: folder.title,
          createdAt: folder.createdAt,
          completionPercentage,
          averageScore,
        };
      });

      return NextResponse.json({ folders: foldersWithProgress });
    }
  } catch (error) {
    console.error("Error fetching folder(s):", error);
    return NextResponse.json({ message: "Fetch failed" }, { status: 500 });
  }
}

// ... (POST, PUT, DELETE functions remain unchanged)
export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { title } = body;
  if (!title) {
    return NextResponse.json({ message: "Title is required" }, { status: 400 });
  }
  try {
    const folder = await prisma.folder.create({
      data: {
        userId,
        title,
      },
    });
    return NextResponse.json(
      { message: "Folder created", folder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { id, title } = body;
  if (!id || !title) {
    return NextResponse.json(
      { message: "ID and new title are required" },
      { status: 400 }
    );
  }
  try {
    const updated = await prisma.folder.update({
      where: { id },
      data: { title },
    });
    return NextResponse.json({ message: "Folder updated", folder: updated });
  } catch (error) {
    console.error("Error updating folder:", error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json(
      { message: "Folder ID is required" },
      { status: 400 }
    );
  }
  try {
    await prisma.folder.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Folder deleted" });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
