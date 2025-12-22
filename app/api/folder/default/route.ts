import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

// GET: Get or create the default "My Resources" folder for the user
export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Try to find existing "My Resources" folder
    let folder = await prisma.folder.findFirst({
      where: {
        userId,
        title: "My Resources",
      },
    });

    // If not found, create it
    if (!folder) {
      folder = await prisma.folder.create({
        data: {
          userId,
          title: "My Resources",
        },
      });
    }

    return NextResponse.json({ folder }, { status: 200 });
  } catch (error) {
    console.error("Error getting/creating default folder:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
