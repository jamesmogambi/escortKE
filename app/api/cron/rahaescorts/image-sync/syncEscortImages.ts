import { uploadImageToS3 } from "@/lib/s3";
import Escort from "@/models/Escort";
// import { uploadImageToS3 } from "@/lib/s3"; // your existing S3 upload logic

export async function syncEscortImages(escort: any) {
  const imageUrls = escort.images.filter(Boolean); // assuming raw URLs already exist
  const uploaded = await Promise.all(imageUrls.map(uploadImageToS3));

  await Escort.findByIdAndUpdate(escort._id, {
    $set: { images: uploaded },
    $setOnInsert: { avatar: uploaded[0] }, // optional fallback
  });
}
