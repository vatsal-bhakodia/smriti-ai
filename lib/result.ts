import { NextRequest, NextResponse } from "next/server";

/**
 * Shared helpers for /api/result proxy routes that forward to BACKEND_URL (CMS).
 * Used by captcha and login proxies to forward JSESSIONID and copy Set-Cookie.
 */

export function getSessionCookies(req: NextRequest): string {
  const existingCookies: string[] = [];
  const existingCookiesHeader = req.headers.get("cookie");
  if (existingCookiesHeader) {
    existingCookiesHeader.split(";").forEach((cookie) => {
      const parts = cookie.trim().split("=");
      if (parts.length === 2) {
        const key = parts[0].trim();
        if (key === "JSESSIONID" || key.startsWith("JSESSION")) {
          existingCookies.push(cookie.trim());
        }
      }
    });
  }
  return existingCookies.join("; ");
}

export function copySessionCookiesToResponse(
  backendResponse: Response,
  nextResponse: NextResponse
): void {
  const setCookieHeaders = backendResponse.headers.getSetCookie();
  if (!setCookieHeaders?.length) return;
  setCookieHeaders.forEach((cookie) => {
    const parts = cookie.split(";")[0].split("=");
    if (parts.length === 2) {
      const key = parts[0].trim();
      const value = parts[1].trim();
      if (key === "JSESSIONID" || key.startsWith("JSESSION")) {
        nextResponse.cookies.set(key, value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24,
          path: "/",
        });
      }
    }
  });
}

export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (e: unknown) {
    clearTimeout(timeoutId);
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error(
        "Request timeout: The server took too long to respond. Please try again."
      );
    }
    throw e;
  }
}
