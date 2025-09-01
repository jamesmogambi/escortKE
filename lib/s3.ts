// // lib/s3.ts
// import { S3Client } from "@aws-sdk/client-s3";
// import { PutObjectCommand } from "@aws-sdk/client-s3";

// export const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

// // lib/uploadToS3.ts
// export async function uploadImageToS3(
//   key: string,
//   buffer: Buffer,
//   mimeType: string
// ): Promise<string> {
//   await s3.send(
//     new PutObjectCommand({
//       Bucket: process.env.AWS_S3_BUCKET!,
//       Key: key,
//       Body: buffer,
//       ContentType: mimeType,
//       ACL: "public-read", // or omit for private
//     })
//   );

//   return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
// }
// lib/uploadImageToS3.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import crypto from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function generateImageKey(imageUrl: string): string {
  const hash = crypto.createHash("md5").update(imageUrl).digest("hex");
  const extension = imageUrl.split(".").pop()?.split("?")[0] || "jpg";
  return `escorts/${hash}.${extension}`;
}

export async function uploadImageToS3(imageUrl: string): Promise<string> {
  const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data);

  const mimeType = response.headers["content-type"] || "image/jpeg";

  const key = generateImageKey(imageUrl);

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Body: buffer,
      ContentType: mimeType, // You can dynamically detect MIME type if needed
      //   ACL: "public-read", // Optional: makes the file publicly accessible
    })
  );

  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}
