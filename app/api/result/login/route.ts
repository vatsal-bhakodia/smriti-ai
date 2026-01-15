import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "crypto";

const BASE_URL = "https://examweb.ggsipu.ac.in";
const LOGIN_URL = `${BASE_URL}/web/Login`;
const LOGINP_PAGE_URL = `${BASE_URL}/web/login.jsp`;
const RESULT_API_URL = `${BASE_URL}/web/StudentSearchProcess`;

/**
 * API Parameters:
 * - flag: Search mode (from searchMode dropdown, commonly 2)
 *   - Different values may filter/search results differently
 * - euno: Exam Unit Number (Semester/Annual exam number)
 *   - euno=1, 2, 3, etc.: Returns results for that specific semester/exam
 *   - euno=100: Returns ALL semesters' results
 *   - Each result entry in the response has its own euno indicating which semester it belongs to
 */

// Hash password using SHA-256 and base64 encode (matching client-side behavior)
function hashPassword(password: string, captcha: string): string {
  const combined = password + captcha;
  const hash = createHash("sha256").update(combined).digest();
  return Buffer.from(hash).toString("base64");
}

// Interface for API response
interface ResultAPIResponse {
  nrollno: string;
  stname: string;
  byoa: number;
  yoa: number;
  father: string;
  prgcode: string;
  prgname: string;
  icode: string;
  iname: string;
  euno: number;
  papercode: string;
  papername: string;
  minorprint: string;
  majorprint: string;
  moderatedprint: string;
  statuscode: string;
  rmonth: number;
  ryear: number;
  declareddate: string;
  eugpa: number;
}

// Parse HTML error messages from login response
function parseLoginError(
  html: string
): { error: string; status: number } | null {
  // Check for captcha validation failure
  if (
    html.includes("Captcha validation fails") ||
    html.includes("captcha validation fails")
  ) {
    const match = html.match(/<h2[^>]*>\s*([^<]+?)\s*<\/h2>/i);
    const errorMessage = match
      ? match[1].trim()
      : "Captcha validation failed. Please try again.";
    return { error: errorMessage, status: 400 };
  }

  // Check for account locked error
  if (
    html.includes("Locked") ||
    html.includes("locked") ||
    html.includes("account is Locked")
  ) {
    const match = html.match(/<h2[^>]*>\s*([^<]+?)\s*<\/h2>/i);
    const errorMessage = match
      ? match[1].trim()
      : "Your account is locked. Please contact Examination Division, GGSIPU University.";
    return { error: errorMessage, status: 403 };
  }

  // Check for login error (wrong password, etc.)
  if (html.includes("Login Error") || html.includes("login error")) {
    const match = html.match(/<h2[^>]*>\s*([^<]+?)\s*<\/h2>/i);
    if (match) {
      const errorText = match[1].trim();
      // Extract attempt count if present (e.g., "Login Error! 2 attempts left.")
      const attemptMatch = errorText.match(/(\d+)\s+attempts?\s+left/i);
      if (attemptMatch) {
        const attemptsLeft = attemptMatch[1];
        return {
          error: `Login failed. ${attemptsLeft} attempt${
            attemptsLeft !== "1" ? "s" : ""
          } left.`,
          status: 401,
        };
      }
      // Return the full error text if no attempt count found
      return { error: errorText, status: 401 };
    }
    return {
      error: "Login failed. Please check your credentials.",
      status: 401,
    };
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { enrollmentNumber, password, captcha } = body;

    if (!enrollmentNumber || !password || !captcha) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get cookie store instance
    const cookieStore = await cookies();

    // Create a session/cookie store - only for GGSIPU cookies
    const cookieJar: Map<string, string> = new Map();

    // Load existing GGSIPU cookies from request (only JSESSIONID)
    const existingCookies = req.headers.get("cookie");
    if (existingCookies) {
      existingCookies.split(";").forEach((cookie) => {
        const parts = cookie.trim().split("=");
        if (parts.length === 2) {
          const key = parts[0].trim();
          const value = parts[1].trim();
          // Only store GGSIPU session cookies (JSESSIONID, etc.)
          if (key === "JSESSIONID" || key.startsWith("JSESSION")) {
            cookieJar.set(key, value);
          }
        }
      });
    }

    // Also check Next.js cookie store for stored session cookies
    const storedSessionId = cookieStore.get("JSESSIONID");
    if (storedSessionId?.value) {
      cookieJar.set("JSESSIONID", storedSessionId.value);
    }

    // Helper function to parse cookies from Set-Cookie headers
    const parseCookies = (setCookieHeaders: string[]) => {
      setCookieHeaders.forEach((cookie) => {
        const parts = cookie.split(";")[0].split("=");
        if (parts.length === 2) {
          const key = parts[0].trim();
          const value = parts[1].trim();
          // Only store GGSIPU session cookies
          if (key === "JSESSIONID" || key.startsWith("JSESSION")) {
            cookieJar.set(key, value);
          }
        }
      });
    };

    // Helper function to build cookie string - only include GGSIPU session cookies
    const buildCookieString = () => {
      const ggsipuCookies: string[] = [];
      cookieJar.forEach((value, key) => {
        // Only include GGSIPU session cookies (JSESSIONID)
        ggsipuCookies.push(`${key}=${value}`);
      });
      return ggsipuCookies.join("; ");
    };

    // Helper function to set cookies in Next.js response
    const setCookiesInResponse = (response: NextResponse) => {
      cookieJar.forEach((value, key) => {
        // Store session cookies in Next.js cookie store
        if (key === "JSESSIONID" || key.startsWith("JSESSION")) {
          cookieStore.set(key, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
          });
          // Also set in response headers for client
          response.cookies.set(key, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
          });
        }
      });
      return response;
    };

    // Step 1: Visit the login page to get session cookies
    const loginPageResponse = await fetch(LOGINP_PAGE_URL, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: BASE_URL,
        ...(buildCookieString() && { Cookie: buildCookieString() }),
      },
    });

    // Extract and store cookies from login page
    const setCookieHeaders = loginPageResponse.headers.getSetCookie();
    parseCookies(setCookieHeaders);

    // Step 2: Hash the password (matching client-side behavior)
    // The website does: SHA-256(password + captcha) then base64 encodes it
    const hashedPassword = hashPassword(password, captcha.toUpperCase());

    // Step 3: Submit login form
    const formData = new URLSearchParams();
    formData.append("username", enrollmentNumber); // Field name is "username" per the form
    formData.append("passwd", hashedPassword); // Field name is "passwd" not "password"
    formData.append("captcha", captcha.toUpperCase());

    // Step 3: Submit login form (don't follow redirects - we need to capture cookies from 302 response)
    const loginResponse = await fetch(LOGIN_URL, {
      method: "POST",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: LOGINP_PAGE_URL,
        Origin: BASE_URL,
        Cookie: buildCookieString(),
      },
      body: formData.toString(),
      redirect: "manual", // Don't follow redirects automatically to capture cookies
    });

    // Update cookies from login response (including 302 redirect cookies)
    const loginSetCookieHeaders = loginResponse.headers.getSetCookie();
    parseCookies(loginSetCookieHeaders);

    const loginStatus = loginResponse.status;
    const locationHeader = loginResponse.headers.get("location");

    // Check if login was successful (302 redirect to studenthome.jsp)
    const isLoginSuccessful =
      loginStatus === 302 &&
      locationHeader &&
      locationHeader.includes("studenthome.jsp");

    // If not redirected (302), read the response body to check for errors
    let loginHTML = "";
    if (!isLoginSuccessful) {
      loginHTML = await loginResponse.text();
    }

    // If not redirected to student home page (302), login was unsuccessful
    if (!isLoginSuccessful) {
      // check for HTML error messages (captcha or login errors)
      const htmlError = parseLoginError(loginHTML);
      if (htmlError) {
        const errorResponse = NextResponse.json(
          { error: htmlError.error },
          { status: htmlError.status }
        );
        // Still save cookies even on error (might have new session)
        return setCookiesInResponse(errorResponse);
      }

      // Check for other error indicators
      if (
        loginHTML.includes("Invalid") ||
        loginHTML.includes("Wrong") ||
        loginHTML.includes("incorrect") ||
        loginHTML.includes("failed") ||
        loginHTML.includes("Locked") ||
        loginHTML.includes("locked") ||
        loginHTML.includes("login.jsp") ||
        (locationHeader && locationHeader.includes("login.jsp"))
      ) {
        // Try to extract the specific error message
        const errorPatterns = [
          /<h2[^>]*>\s*([^<]+?)\s*<\/h2>/i, // Check h2 tags first (common for error messages)
          /<div[^>]*class[^>]*error[^>]*>([^<]+)<\/div>/i,
          /<span[^>]*class[^>]*error[^>]*>([^<]+)<\/span>/i,
          /Invalid[^<]*/i,
          /Wrong[^<]*/i,
        ];

        let errorMessage = "Invalid credentials or captcha. Please try again.";
        for (const pattern of errorPatterns) {
          const match = loginHTML.match(pattern);
          if (match && match[1]) {
            errorMessage = match[1].trim();
            break;
          }
        }

        // Determine status code based on error type
        let statusCode = 401;
        if (loginHTML.includes("Locked") || loginHTML.includes("locked")) {
          statusCode = 403;
        }

        const errorResponse = NextResponse.json(
          { error: errorMessage },
          { status: statusCode }
        );
        // Still save cookies even on error (might have new session)
        return setCookiesInResponse(errorResponse);
      }

      // Unknown error - not redirected and no error message found
      const errorResponse = NextResponse.json(
        { error: "Login failed. Please try again." },
        { status: 500 }
      );
      return setCookiesInResponse(errorResponse);
    }

    // Step 4: After successful login, visit student home page first to establish session
    // This ensures all cookies are properly set
    const studentHomeUrl = `${BASE_URL}/web/student/studenthome.jsp`;
    const studentHomeResponse = await fetch(studentHomeUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: LOGIN_URL,
        Cookie: buildCookieString(),
      },
      redirect: "follow",
    });

    // Update cookies from student home page response
    const homeSetCookieHeaders = studentHomeResponse.headers.getSetCookie();
    if (homeSetCookieHeaders) {
      parseCookies(homeSetCookieHeaders);
    }

    // Step 5: Now fetch all semester results (euno=100)
    const resultApiResponse = await fetch(`${RESULT_API_URL}?flag=2&euno=100`, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: studentHomeUrl, // Use student home page as referer after login
        Cookie: buildCookieString(),
      },
      redirect: "follow",
    });

    // Update cookies from result API response if any
    const resultSetCookieHeaders = resultApiResponse.headers.getSetCookie();
    if (resultSetCookieHeaders) {
      parseCookies(resultSetCookieHeaders);
    }

    if (!resultApiResponse.ok) {
      // Try to read response body for error details
      let errorMessage =
        "Failed to fetch results. Please try logging in again.";
      try {
        const errorText = await resultApiResponse.text();

        // Try to parse as JSON to get detailed error message
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) {
            errorMessage = errorJson.message;
          } else if (errorJson.error) {
            errorMessage = errorJson.error;
          }
        } catch {
          // Not JSON, use raw text if available
          if (errorText && errorText.length > 0) {
            errorMessage = errorText.substring(0, 100);
          }
        }
      } catch (e) {
        // Error reading response body
      }

      const errorResponse = NextResponse.json(
        {
          error: errorMessage,
          statusCode: resultApiResponse.status,
          details: "Session might have expired. Please try logging in again.",
        },
        { status: 500 }
      );
      return setCookiesInResponse(errorResponse);
    }

    // Parse JSON response - return raw API data for frontend filtering
    const apiData: ResultAPIResponse[] = await resultApiResponse.json();

    if (!apiData || apiData.length === 0) {
      const errorResponse = NextResponse.json(
        {
          error: "No results found. Please check your enrollment number.",
          details:
            "The enrollment number might be incorrect or no results are available for this student.",
        },
        { status: 404 }
      );
      return setCookiesInResponse(errorResponse);
    }

    // Return all results data for frontend to filter
    const successResponse = NextResponse.json({
      success: true,
      message: "Login successful",
      enrollmentNumber,
      results: apiData, // Raw API data for frontend processing
    });

    // Set cookies in the response to persist session
    return setCookiesInResponse(successResponse);
  } catch (error) {
    console.error("Error in login route:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
