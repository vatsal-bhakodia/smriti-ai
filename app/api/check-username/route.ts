import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { message: "Username is required" },
        { status: 400 }
      );
    }

    // Check if username exists
    const existingUser = await prisma.user.findUnique({
      where: { username: username.toLowerCase().trim() },
    });

    return NextResponse.json({
      available: !existingUser,
      username,
    });
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      { message: "Error checking username availability" },
      { status: 500 }
    );
  }
}
