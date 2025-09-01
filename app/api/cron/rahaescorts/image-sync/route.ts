import { NextResponse } from "next/server";
import Escort from "@/models/Escort";
import ImageSyncTracker from "@/models/ImageSyncTracker";
// import { syncEscortImages } from "@/lib/imageSync";
import { connectToDB } from "@/lib/mongoose";
import { syncEscortImages } from "./syncEscortImages";

export async function GET() {
  await connectToDB();

  const tracker =
    (await ImageSyncTracker.findOne()) || (await ImageSyncTracker.create({}));
  const escorts = await Escort.find().select("_id images slug").lean();

  if (tracker.nextIndex >= escorts.length) {
    tracker.nextIndex = 0; // reset if done
  }

  const escort = escorts[tracker.nextIndex];
  if (!escort) return NextResponse.json({ message: "No escort found" });

  try {
    await syncEscortImages(escort);
    tracker.nextIndex += 1;
    await tracker.save();

    return NextResponse.json({
      message: `Synced images for escort ${escort.slug}`,
      nextIndex: tracker.nextIndex,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Sync failed", details: err },
      { status: 500 }
    );
  }
}
