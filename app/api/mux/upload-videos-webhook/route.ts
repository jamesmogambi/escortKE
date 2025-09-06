// import { NextRequest, NextResponse } from "next/server";
// import crypto from "crypto";
// // import Video from "@/models/Video";
// import { connectToDB } from "@/lib/mongoose";

// const muxSigningSecret = process.env.MUX_SIGNING_SECRET!;

// export async function POST(req: NextRequest) {
//   try {
//     await connectToDB();

//     const signatureHeader = req.headers.get("mux-signature");
//     if (!signatureHeader) {
//       return NextResponse.json({ error: "Missing signature" }, { status: 400 });
//     }

//     const [timestampPart, signaturePart] = signatureHeader.split(",");
//     const timestamp = timestampPart.replace("t=", "");
//     const receivedSignature = signaturePart.replace("v1=", "");

//     const rawBody = await req.text(); // ✨ Accurate raw body
//     const payload = `${timestamp}.${rawBody}`;

//     const expectedSignature = crypto
//       .createHmac("sha256", muxSigningSecret)
//       .update(payload)
//       .digest("hex");

//     if (expectedSignature !== receivedSignature) {
//       console.warn("Signature mismatch");
//       console.log("Expected:", expectedSignature);
//       console.log("Received:", receivedSignature);
//       return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
//     }

//     const muxEvent = JSON.parse(rawBody);
//     const asset = muxEvent.data;
//     const clerkUserId = asset.passthrough;

//     console.log("passthrough", clerkUserId);

//     if (muxEvent.type !== "video.asset.ready" || !clerkUserId) {
//       return NextResponse.json({ message: "No actionable event." });
//     }

//     // const existing = await Video.findOne({ videoId: videoID });
//     // if (!existing) {
//     //   return NextResponse.json(
//     //     { error: "No matching videoId found" },
//     //     { status: 404 }
//     //   );
//     // }

//     // if (existing.muxAssetId === asset.id) {
//     //   return NextResponse.json({ message: "Already updated." });
//     // }

//     // existing.muxAssetId = asset.id;
//     // existing.muxPlaybackId = asset.playback_ids?.[0]?.id || "";
//     // existing.muxResolution = asset.max_stored_resolution;
//     // existing.muxAspectRatio = asset.aspect_ratio || "";
//     // existing.muxStatus = "ready";

//     // await existing.save();

//     return NextResponse.json({
//       message: "Video updated successfully!",
//       clerkUserId,
//     });
//   } catch (error: any) {
//     console.error("Mux webhook error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // import { NextRequest, NextResponse } from "next/server";
// // import crypto from "crypto";
// // import { connectToDB } from "@/lib/mongoose";

// // const muxSigningSecret = process.env.MUX_SIGNING_SECRET!;

// // export const config = {
// //   api: {
// //     bodyParser: false, // Ensure raw body is preserved
// //   },
// // };

// // export async function POST(req: NextRequest) {
// //   try {
// //     await connectToDB();

// //     const signatureHeader = req.headers.get("mux-signature");
// //     if (!signatureHeader) {
// //       console.warn("Missing Mux-Signature header");
// //       return NextResponse.json({ error: "Missing signature" }, { status: 400 });
// //     }

// //     // Defensive parsing of signature header
// //     const parts = signatureHeader.split(",").reduce((acc, part) => {
// //       const [key, value] = part.split("=");
// //       acc[key] = value;
// //       return acc;
// //     }, {} as Record<string, string>);

// //     const timestamp = parts["t"];
// //     const receivedSignature = parts["v1"];

// //     if (!timestamp || !receivedSignature) {
// //       console.warn("Malformed signature header:", signatureHeader);
// //       return NextResponse.json(
// //         { error: "Malformed signature" },
// //         { status: 400 }
// //       );
// //     }

// //     const rawBody = await req.text();
// //     const payload = `${timestamp}.${rawBody}`;

// //     const expectedSignature = crypto
// //       .createHmac("sha256", muxSigningSecret)
// //       .update(payload)
// //       .digest("hex");

// //     const expected = Buffer.from(expectedSignature, "utf-8");
// //     const received = Buffer.from(receivedSignature, "utf-8");

// //     if (
// //       expected.length !== received.length ||
// //       !crypto.timingSafeEqual(expected, received)
// //     ) {
// //       console.warn("Signature mismatch");
// //       console.log("Expected:", expectedSignature);
// //       console.log("Received:", receivedSignature);
// //       return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
// //     }

// //     const muxEvent = JSON.parse(rawBody);
// //     const asset = muxEvent.data;
// //     const clerkUserId = asset.passthrough;

// //     console.log("Mux event type:", muxEvent.type);
// //     console.log("Passthrough user ID:", clerkUserId);

// //     if (muxEvent.type !== "video.asset.ready" || !clerkUserId) {
// //       return NextResponse.json({ message: "No actionable event." });
// //     }

// //     // Optional: Update your Video model here
// //     // const existing = await Video.findOne({ videoId: asset.passthrough });
// //     // if (!existing) {
// //     //   return NextResponse.json({ error: "No matching videoId found" }, { status: 404 });
// //     // }
// //     // if (existing.muxAssetId === asset.id) {
// //     //   return NextResponse.json({ message: "Already updated." });
// //     // }
// //     // existing.muxAssetId = asset.id;
// //     // existing.muxPlaybackId = asset.playback_ids?.[0]?.id || "";
// //     // existing.muxResolution = asset.max_stored_resolution;
// //     // existing.muxAspectRatio = asset.aspect_ratio || "";
// //     // existing.muxStatus = "ready";
// //     // await existing.save();

// //     return NextResponse.json({
// //       message: "Video updated successfully!",
// //       clerkUserId,
// //     });
// //   } catch (error: any) {
// //     console.error("Mux webhook error:", error);
// //     return NextResponse.json({ error: error.message }, { status: 500 });
// //   }
// // }

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDB } from "@/lib/mongoose";
import Escort from "@/models/Escort";

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
      // return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const muxEvent = JSON.parse(rawBody);
    const asset = muxEvent.data;
    const clerkUserId = asset.passthrough;

    console.log("passthrough", clerkUserId);

    if (muxEvent.type !== "video.asset.ready" || !clerkUserId) {
      return NextResponse.json({ message: "No actionable event." });
    }

    const escort = await Escort.findOne({ clerkUserId });
    if (!escort) {
      return NextResponse.json({ error: "Escort not found" }, { status: 404 });
    }

    const playbackId = asset.playback_ids?.[0]?.id || "";
    // Append playbackId to videos array
    escort.videos.push(playbackId);
    await escort.save();

    return NextResponse.json({ message: "Playback ID added" }, { status: 201 });
  } catch (error: any) {
    console.error("Mux webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
