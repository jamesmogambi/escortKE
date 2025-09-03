import { NextRequest, NextResponse } from "next/server";
import { Mux } from "@mux/mux-node";

const muxClient = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { clerkUserID } = await req.json();

    if (!clerkUserID) {
      return NextResponse.json({ error: "Missing User ID!" }, { status: 400 });
    }

    // const origin = req.headers.get("origin") || "https://yourdomain.com";
    // console.log("muxClient.video", muxClient.video);
    const upload = await muxClient.video.uploads.create({
      new_asset_settings: {
        playback_policies: ["public"], // ✅ Use array instead of string
        passthrough: clerkUserID,
      },
      cors_origin: "*",
    });

    return NextResponse.json({
      uploadUrl: upload.url,
      uploadId: upload.id,
    });
  } catch (error) {
    console.error("Mux upload creation failed:", error);
    return NextResponse.json(
      { error: "Upload creation failed", details: String(error) },
      { status: 500 }
    );
  }
}
