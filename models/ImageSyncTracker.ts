import mongoose, { Schema, Document } from "mongoose";

interface ImageSyncTrackerDoc extends Document {
  nextIndex: number;
}

const ImageSyncTrackerSchema = new Schema<ImageSyncTrackerDoc>({
  nextIndex: { type: Number, default: 0 },
});

export default mongoose.models.ImageSyncTracker ||
  mongoose.model<ImageSyncTrackerDoc>(
    "ImageSyncTracker",
    ImageSyncTrackerSchema
  );
