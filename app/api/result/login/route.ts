import { NextRequest, NextResponse } from "next/server";
import {
  getSessionCookies,
  copySessionCookiesToResponse,
  fetchWithTimeout,
} from "@/lib/result";

const BACKEND_URL = process.env.BACKEND_URL;
const REQUEST_TIMEOUT = 8000;

export async function POST(req: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { error: "BACKEND_URL not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { enrollmentNumber, password, captcha } = body;

    if (!enrollmentNumber || !password || !captcha) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const cookieHeader = getSessionCookies(req);
    const url = `${BACKEND_URL}/api/public/result/login`;

    const response = await fetchWithTimeout(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader && { Cookie: cookieHeader }),
        },
        body: JSON.stringify({
          enrollmentNumber,
          password,
          captcha,
        }),
      },
      REQUEST_TIMEOUT
    );

    const text = await response.text();
    const contentType =
      response.headers.get("content-type") ?? "application/json";
    const nextResponse = new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
      },
    });

    copySessionCookiesToResponse(response, nextResponse);
    return nextResponse;
  } catch (error) {
    console.error("Error in login route:", error);

    if (error instanceof Error && error.message.includes("timeout")) {
      return NextResponse.json(
        {
          error:
            "The server is taking too long to respond. The GGSIPU portal might be down or slow. Please try again later.",
          timeout: true,
        },
        { status: 504 }
      );
    }

    if (
      error instanceof Error &&
      (error.message.includes("fetch") || error.message.includes("network"))
    ) {
      return NextResponse.json(
        {
          error:
            "Unable to connect to the GGSIPU portal. The server might be down. Please try again later.",
          networkError: true,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while processing your request. Please try again.",
      },
      { status: 500 }
    );
  }
}
