import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface ContactRequestBody {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequestBody = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { message: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Validate message length
    if (body.message.trim().length < 10) {
      return NextResponse.json(
        { message: "Message must be at least 10 characters long" },
        { status: 400 }
      );
    }

    // Validate name length
    if (body.name.trim().length < 2) {
      return NextResponse.json(
        { message: "Name must be at least 2 characters long" },
        { status: 400 }
      );
    }

    // Save to database
    const contactQuery = await prisma.contactQuery.create({
      data: {
        name: body.name.trim(),
        email: body.email.trim(),
        subject: body.subject?.trim() || null,
        message: body.message.trim(),
      },
    });

    console.log("Contact query saved:", contactQuery.id);

    return NextResponse.json(
      { 
        message: "Your message has been sent successfully! We'll get back to you soon.",
        id: contactQuery.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error processing contact form:", error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("unique constraint")) {
        return NextResponse.json(
          { message: "There was an issue processing your request. Please try again." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

// Handle GET requests (optional - for health check or documentation)
export async function GET() {
  return NextResponse.json(
    { 
      message: "Contact API endpoint",
      methods: ["POST"],
      fields: ["name", "email", "subject (optional)", "message"]
    },
    { status: 200 }
  );
}
