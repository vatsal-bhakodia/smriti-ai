import { NextRequest, NextResponse } from "next/server";
import { normalizePaperCode } from "@/utils/result";

const BACKEND_URL = process.env.BACKEND_URL;

// Proxy API to fetch subject credits from CMS
export async function POST(request: NextRequest) {
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

    if (!BACKEND_URL) {
      const mockCredits: Record<string, { total: number; theory: number; practical: number }> = {};
      normalizedCodes.forEach((code) => {
        mockCredits[code] = { total: 4, theory: 4, practical: 0 };
      });
      return NextResponse.json({ credits: mockCredits });
    }

    // Call CMS API
    const response = await fetch(`${BACKEND_URL}/api/public/result/credits`, {
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

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in credits proxy:", error);
    return NextResponse.json(
      { error: "Failed to fetch subject credits" },
      { status: 500 }
    );
  }
}
