import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// POST: Log daily user login and update streak
export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day

    // Get current user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastLogin: true, currentStreak: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const lastLoginDate = new Date(user.lastLogin);
    lastLoginDate.setHours(0, 0, 0, 0);

    // Check if user already logged in today
    if (lastLoginDate.getTime() === today.getTime()) {
      return NextResponse.json({
        message: "Login already recorded for today",
        alreadyLogged: true,
        currentStreak: user.currentStreak,
      });
    }

    // Calculate new streak
    let newStreak = user.currentStreak;
    let streakBroken = false;
    const previousStreak = user.currentStreak;
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (lastLoginDate.getTime() === yesterday.getTime()) {
      // Consecutive day - increment streak
      newStreak += 1;
    } else if (lastLoginDate.getTime() < yesterday.getTime()) {
      // Gap in login - reset streak to 1
      streakBroken = true;
      newStreak = 1;
    }
    // If lastLoginDate > yesterday, it's a future date (shouldn't happen), keep current streak

    // Update user with new login time and streak
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        lastLogin: today,
        currentStreak: newStreak,
      },
      select: { lastLogin: true, currentStreak: true },
    });

    return NextResponse.json({
      message: "Daily login recorded successfully",
      currentStreak: updatedUser.currentStreak,
      previousStreak,
      streakBroken,
      alreadyLogged: false,
    });
  } catch (error) {
    console.error("Error logging daily login:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET: Retrieve current streak score
export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentStreak: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      currentStreak: user.currentStreak,
    });
  } catch (error) {
    console.error("Error fetching streak:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
