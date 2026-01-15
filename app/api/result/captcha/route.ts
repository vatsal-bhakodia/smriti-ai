import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const CAPTCHA_URL = "https://examweb.ggsipu.ac.in/web/CaptchaServlet";
const LOGINP_PAGE_URL = "https://examweb.ggsipu.ac.in/web/login.jsp";

export async function GET(req: NextRequest) {
  try {
    // Get cookie store instance
    const cookieStore = await cookies();

    // Build cookie string from existing cookies if available
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

    // Also check Next.js cookie store
    const storedSessionId = cookieStore.get("JSESSIONID");
    if (
      storedSessionId?.value &&
      !existingCookies.some((c) => c.startsWith("JSESSIONID"))
    ) {
      existingCookies.push(`JSESSIONID=${storedSessionId.value}`);
    }

    const existingCookieString = existingCookies.join("; ");

    // First, visit the login page to establish a session (or refresh existing one)
    const loginPageResponse = await fetch(LOGINP_PAGE_URL, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        ...(existingCookieString && { Cookie: existingCookieString }),
      },
    });

    // Extract cookies from the login page response
    const setCookieHeaders = loginPageResponse.headers.getSetCookie();
    const cookieString = setCookieHeaders
      .map((cookie) => cookie.split(";")[0])
      .join("; ");

    // Store JSESSIONID cookie if present
    setCookieHeaders.forEach((cookie) => {
      const parts = cookie.split(";")[0].split("=");
      if (parts.length === 2) {
        const key = parts[0].trim();
        const value = parts[1].trim();
        if (key === "JSESSIONID" || key.startsWith("JSESSION")) {
          cookieStore.set(key, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
          });
        }
      }
    });

    // Fetch captcha image from GGSIPU server with session cookies
    const response = await fetch(CAPTCHA_URL, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/png,image/*;q=0.8,*/*;q=0.5",
        Referer: "https://examweb.ggsipu.ac.in/web/login.jsp",
        Cookie: cookieString,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch captcha" },
        { status: response.status }
      );
    }

    // Get the image as a blob
    const imageBlob = await response.blob();

    // Update cookies from captcha response if any
    const captchaSetCookieHeaders = response.headers.getSetCookie();
    const captchaResponse = new NextResponse(imageBlob, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    // Store any new session cookies from captcha response
    if (captchaSetCookieHeaders) {
      captchaSetCookieHeaders.forEach((cookie) => {
        const parts = cookie.split(";")[0].split("=");
        if (parts.length === 2) {
          const key = parts[0].trim();
          const value = parts[1].trim();
          if (key === "JSESSIONID" || key.startsWith("JSESSION")) {
            cookieStore.set(key, value, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 60 * 60 * 24, // 24 hours
              path: "/",
            });
            captchaResponse.cookies.set(key, value, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 60 * 60 * 24, // 24 hours
              path: "/",
            });
          }
        }
      });
    }

    return captchaResponse;
  } catch (error) {
    console.error("Error fetching captcha:", error);
    return NextResponse.json(
      { error: "Failed to fetch captcha image" },
      { status: 500 }
    );
  }
}
