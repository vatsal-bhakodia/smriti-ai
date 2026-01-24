import { NextRequest, NextResponse } from "next/server";
import {
  getSessionCookies,
  copySessionCookiesToResponse,
} from "@/lib/result";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(req: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { error: "BACKEND_URL not configured" },
      { status: 500 }
    );
  }

  try {
    const cookieHeader = getSessionCookies(req);
    const url = `${BACKEND_URL}/api/public/result/captcha`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch captcha" },
        { status: response.status }
      );
    }

    const imageBlob = await response.blob();
    const captchaResponse = new NextResponse(imageBlob, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    copySessionCookiesToResponse(response, captchaResponse);
    return captchaResponse;
  } catch (error) {
    console.error("Error fetching captcha:", error);
    return NextResponse.json(
      { error: "Failed to fetch captcha image" },
      { status: 500 }
    );
  }
}
