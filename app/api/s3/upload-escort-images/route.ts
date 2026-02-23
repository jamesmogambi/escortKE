import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("images") as File[];

  // Generate placeholder URLs immediately
  const timestamp = Date.now();
  const placeholderUrls = files.map((file, i) => {
    const key = `escorts/${timestamp}-${i}-${file.name}`;
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  });

  // Trigger background upload
  setTimeout(() => {
    files.forEach(async (file, i) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const key = `escorts/${timestamp}-${i}-${file.name}`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      });

      try {
        await s3.send(command);
        console.log(`✅ Uploaded: ${key}`);
      } catch (err) {
        console.error(`❌ Failed to upload ${key}`, err);
      }
    });
  }, 0);

  // Respond immediately with 201 Created
  return NextResponse.json({ imageUrls: placeholderUrls }, { status: 201 });
}
