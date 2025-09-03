import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
// import Video from "@/models/Video";
import { connectToDB } from "@/lib/mongoose";

const muxSigningSecret = process.env.MUX_SIGNING_SECRET!;

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const signatureHeader = req.headers.get("mux-signature");
    if (!signatureHeader) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const [timestampPart, signaturePart] = signatureHeader.split(",");
    const timestamp = timestampPart.replace("t=", "");
    const receivedSignature = signaturePart.replace("v1=", "");

    const rawBody = await req.text(); // ✨ Accurate raw body
    const payload = `${timestamp}.${rawBody}`;

    const expectedSignature = crypto
      .createHmac("sha256", muxSigningSecret)
      .update(payload)
      .digest("hex");

    if (expectedSignature !== receivedSignature) {
      console.warn("Signature mismatch");
      console.log("Expected:", expectedSignature);
      console.log("Received:", receivedSignature);
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const muxEvent = JSON.parse(rawBody);
    const asset = muxEvent.data;
    const clerkUserId = asset.passthrough;

    console.log("passthrough", clerkUserId);

    if (muxEvent.type !== "video.asset.ready" || !clerkUserId) {
      return NextResponse.json({ message: "No actionable event." });
    }

    // const existing = await Video.findOne({ videoId: videoID });
    // if (!existing) {
    //   return NextResponse.json(
    //     { error: "No matching videoId found" },
    //     { status: 404 }
    //   );
    // }

    // if (existing.muxAssetId === asset.id) {
    //   return NextResponse.json({ message: "Already updated." });
    // }

    // existing.muxAssetId = asset.id;
    // existing.muxPlaybackId = asset.playback_ids?.[0]?.id || "";
    // existing.muxResolution = asset.max_stored_resolution;
    // existing.muxAspectRatio = asset.aspect_ratio || "";
    // existing.muxStatus = "ready";

    // await existing.save();

    return NextResponse.json({
      message: "Video updated successfully!",
      clerkUserId,
    });
  } catch (error: any) {
    console.error("Mux webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
