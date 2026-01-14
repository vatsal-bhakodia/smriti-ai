import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const universitySlug = searchParams.get("universitySlug");
    const programSlug = searchParams.get("programSlug");
    const semester = searchParams.get("semester");
    const branch = searchParams.get("branch");

    if (!universitySlug || !programSlug || !semester) {
      return NextResponse.json(
        { message: "universitySlug, programSlug, and semester are required" },
        { status: 400 }
      );
    }

    const cmsUrl = process.env.CMS_URL;
    if (!cmsUrl) {
      return NextResponse.json(
        { message: "CMS URL not configured" },
        { status: 500 }
      );
    }

    const baseUrl = cmsUrl.replace(/\/$/, "");
    const url = new URL(
      `${baseUrl}/api/public/programs/${universitySlug}/${programSlug}/subjects`
    );
    url.searchParams.set("semester", semester);
    if (branch) {
      url.searchParams.set("branch", branch);
    }

    const response = await axios.get(url.toString());
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { message: "Failed to fetch subjects", error: error.message },
      { status: 500 }
    );
  }
}
