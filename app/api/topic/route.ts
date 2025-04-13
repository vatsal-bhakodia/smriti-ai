import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

// GET: Get topic by ID or list all topics for the user
export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      // Fetch a single topic by ID
      const topic = await prisma.topic.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!topic) {
        return NextResponse.json(
          { message: "Topic not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ topic });
    } else {
      // Fetch all topics for the user
      const topics = await prisma.topic.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json({ topics });
    }
  } catch (error) {
    console.error("Error fetching topic(s):", error);
    return NextResponse.json({ message: "Fetch failed" }, { status: 500 });
  }
}

// POST: Create new topic
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
    const topic = await prisma.topic.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(
      { message: "Topic created", topic },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating topic:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: Update topic
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
    const updated = await prisma.topic.update({
      where: { id },
      data: { title },
    });

    return NextResponse.json({ message: "Topic updated", topic: updated });
  } catch (error) {
    console.error("Error updating topic:", error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

// DELETE: Delete topic
export async function DELETE(req: NextRequest,{params}: { params: { id: string }}) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // const body = await req.json();
  const { id } = params

  if (!id) {
    return NextResponse.json(
      { message: "Topic ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.topic.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Topic deleted" });
  } catch (error) {
    console.error("Error deleting topic:", error);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
