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
  nextResponse: NextResponse,
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
  timeout: number,
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
        "Request timeout: The server took too long to respond. Please try again.",
      );
    }
    throw e;
  }
}

// Helper function to convert program names to short form
// e.g., "BACHELOR OF TECHNOLOGY (INFORMATION TECHNOLOGY)" → "B.Tech (IT)"
// If already in short form like "B.Tech (CSE)", returns as-is
export function getShortProgramName(program: string): string {
  // Patterns that indicate the program is already in short form
  const shortFormPatterns = [
    /^B\.Tech/i,
    /^M\.Tech/i,
    /^B\.Sc/i,
    /^M\.Sc/i,
    /^B\.A\.?(\s|$|\()/i,
    /^M\.A\.?(\s|$|\()/i,
    /^BA[\s\.(]/i,
    /^MA[\s\.(]/i,
    /^B\.Com/i,
    /^M\.Com/i,
    /^BBA/i,
    /^MBA/i,
    /^BCA/i,
    /^MCA/i,
    /^B\.Arch/i,
    /^M\.Arch/i,
    /^B\.Pharma?/i,
    /^M\.Pharma?/i,
    /^B\.Design/i,
    /^M\.Design/i,
    /^B\.Des/i,
    /^M\.Des/i,
    /^LLB/i,
    /^LLM/i,
    /^Ph\.?D/i,
    /^M\.Plan/i,
    /^M\.Ed/i,
    /^B\.Ed/i,
    /^LE-/i, // Lateral Entry programs
    /^PGDFLSA/i,
  ];

  // Check if already in short form - return as-is
  for (const pattern of shortFormPatterns) {
    if (pattern.test(program.trim())) {
      return program;
    }
  }

  // Mapping for full degree names to short forms
  const degreeMap: Record<string, string> = {
    "BACHELOR OF TECHNOLOGY": "B.Tech",
    "MASTER OF TECHNOLOGY": "M.Tech",
    "BACHELOR OF SCIENCE": "B.Sc",
    "MASTER OF SCIENCE": "M.Sc",
    "BACHELOR OF ARTS": "B.A",
    "MASTER OF ARTS": "M.A",
    "BACHELOR OF COMMERCE": "B.Com",
    "MASTER OF COMMERCE": "M.Com",
    "BACHELOR OF BUSINESS ADMINISTRATION": "BBA",
    "MASTER OF BUSINESS ADMINISTRATION": "MBA",
    "BACHELOR OF ENGINEERING": "B.E",
    "MASTER OF ENGINEERING": "M.E",
    "BACHELOR OF COMPUTER APPLICATIONS": "BCA",
    "MASTER OF COMPUTER APPLICATIONS": "MCA",
    "BACHELOR OF ARCHITECTURE": "B.Arch",
    "MASTER OF ARCHITECTURE": "M.Arch",
    "MASTER OF PLANNING": "M.Plan",
    "BACHELOR OF PHARMACY": "B.Pharma",
    "MASTER OF PHARMACY": "M.Pharma",
    "BACHELOR OF DESIGN": "B.Design",
    "MASTER OF DESIGN": "M.Design",
    "BACHELOR OF LAW": "LLB",
    "MASTER OF LAW": "LLM",
    "BACHELOR OF EDUCATION": "B.Ed",
    "MASTER OF EDUCATION": "M.Ed",
    "DOCTOR OF PHILOSOPHY": "Ph.D",
    "DOCTORATE OF PHILOSOPHY": "Ph.D",
  };

  // Extract specialization from parentheses if present
  const parenMatch = program.match(/\(([^)]+)\)/);
  const specialization = parenMatch ? parenMatch[1] : null;

  // Get the base program (everything before the parentheses)
  const baseProgram = program
    .replace(/\s*\([^)]+\)/, "")
    .trim()
    .toUpperCase();

  // Find matching degree
  let shortDegree = "";
  for (const [fullName, shortName] of Object.entries(degreeMap)) {
    if (baseProgram.includes(fullName)) {
      shortDegree = shortName;
      break;
    }
  }

  // If no match found, create acronym from base program
  if (!shortDegree) {
    shortDegree = baseProgram
      .split(/\s+/)
      .filter((word) => !["OF", "AND", "THE", "IN"].includes(word))
      .map((word) => word.charAt(0))
      .join("");
  }

  // Create acronym for specialization
  if (specialization) {
    const specAcronym = specialization
      .toUpperCase()
      .split(/\s+/)
      .filter((word) => !["OF", "AND", "THE", "IN"].includes(word))
      .map((word) => word.charAt(0))
      .join("");
    return `${shortDegree} (${specAcronym})`;
  }

  return shortDegree;
}
