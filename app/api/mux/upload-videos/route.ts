// // app/api/mux/upload-videos/route.ts
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   const formData = await req.formData();
//   const files = formData.getAll("videos") as File[];
//   const userClerkID = formData.get("clerkUserID");

//   const uploadPromises = files.map(async (file) => {
//     const buffer = Buffer.from(await file.arrayBuffer());

//     const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000"; // adjust as needed
//     const response = await fetch(`${baseUrl}/api/mux/create-upload-url`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ clerkUserID: userClerkID }),
//     });

//     const upload = await response.json();

//     // Upload the video file to the signed URL
//     await fetch(upload.uploadUrl, {
//       method: "PUT",
//       headers: {
//         "Content-Type": file.type,
//       },
//       body: buffer,
//     });

//     return {
//       asset_id: upload.uploadUrl,
//       upload_url: upload.uploadId,
//     };
//   });

//   const results = await Promise.all(uploadPromises);
//   return NextResponse.json({ uploads: results });
// }

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("videos") as File[];
  const userClerkID = formData.get("clerkUserID");

  const timestamp = Date.now();

  // Generate placeholder metadata
  const placeholders = files.map((file, i) => ({
    name: file.name,
    type: file.type,
    placeholder: `mux-upload-${timestamp}-${i}`,
  }));

  // Trigger background upload
  setTimeout(() => {
    files.forEach(async (file) => {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());

        const baseUrl =
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000";

        const response = await fetch(`${baseUrl}/api/mux/create-upload-url`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clerkUserID: userClerkID }),
        });

        const upload = await response.json();

        await fetch(upload.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: buffer,
        });

        console.log(`✅ Uploaded video: ${file.name}`);
      } catch (err) {
        console.error(`❌ Failed to upload video: ${file.name}`, err);
      }
    });
  }, 0);

  // Respond immediately with 201 Created
  return NextResponse.json({ uploads: placeholders }, { status: 201 });
}
