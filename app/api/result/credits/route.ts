import { NextRequest, NextResponse } from "next/server";
import { normalizePaperCode } from "@/app/(public)/result/utils";
import { SubjectCreditsResponse } from "@/app/(public)/result/types";

const BACKEND_URL = process.env.BACKEND_URL;

// Proxy API to fetch subject credits from CMS
export async function POST(request: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { error: "BACKEND_URL not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { paperCodes } = body as { paperCodes: string[] };

    if (!paperCodes || !Array.isArray(paperCodes) || paperCodes.length === 0) {
      return NextResponse.json(
        { error: "paperCodes array is required" },
        { status: 400 }
      );
    }

    // Normalize paper codes before sending to CMS
    const normalizedCodes = paperCodes.map(normalizePaperCode);

    // Call CMS API
    const response = await fetch(`${BACKEND_URL}/api/public/subjects/credits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paperCodes: normalizedCodes }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("CMS API error:", errorData);
      return NextResponse.json(
        { error: "Failed to fetch credits from CMS" },
        { status: response.status }
      );
    }

    const data: SubjectCreditsResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in credits proxy:", error);
    return NextResponse.json(
      { error: "Failed to fetch subject credits" },
      { status: 500 }
    );
  }
}
