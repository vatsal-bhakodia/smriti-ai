import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

// GET: get single or multiple resources
export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const topicId = searchParams.get("topicId");

  try {
    if (id) {
      const resource = await prisma.resource.findUnique({ where: { id } });
      if (!resource)
        return NextResponse.json({ message: "Not found" }, { status: 404 });
      return NextResponse.json({ resource });
    }

    if (topicId) {
      const resources = await prisma.resource.findMany({
        where: { topicId },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ resources });
    }

    return NextResponse.json(
      { message: "id or topicId is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("GET resource error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST: create new resource
export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { topicId, title, type, url, summary } = body;

  if (!topicId || !title || !type || !url) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const resource = await prisma.resource.create({
      data: { topicId, title, type, url, summary: summary || "" },
    });

    return NextResponse.json(
      { message: "Resource created", resource },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST resource error:", error);
    return NextResponse.json({ message: "Creation failed" }, { status: 500 });
  }
}

// PUT: update resource
export async function PUT(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, title, summary } = body;

  if (!id)
    return NextResponse.json(
      { message: "Resource ID is required" },
      { status: 400 }
    );

  try {
    const updated = await prisma.resource.update({
      where: { id },
      data: {
        title,
        summary,
      },
    });

    return NextResponse.json({
      message: "Resource updated",
      resource: updated,
    });
  } catch (error) {
    console.error("PUT resource error:", error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

// DELETE: delete resource
export async function DELETE(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // const body = await req.json();
  // const { id } = body;
  const { searchParams } = new URL(req.url);
  const id= searchParams.get('id');

  if (!id)
    return NextResponse.json(
      { message: "Resource ID is required" },
      { status: 400 }
    );

  try {
    await prisma.resource.delete({ where: { id } });
    return NextResponse.json({ message: "Resource deleted" });
  } catch (error) {
    console.error("DELETE resource error:", error);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
