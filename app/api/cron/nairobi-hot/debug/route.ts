// app/api/debug/page/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url");
    if (!url) {
      return NextResponse.json(
        { error: "URL parameter required" },
        { status: 400 },
      );
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const html = await response.text();

    // Return first 5000 chars for debugging
    return NextResponse.json({
      url,
      status: response.status,
      htmlLength: html.length,
      preview: html.substring(0, 5000),
      hasProfilesListing: html.includes("profiles-listing"),
      hasProfilePreview: html.includes("profile-preview"),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
