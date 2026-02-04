import { NextResponse, NextRequest } from "next/server";
import cloudinary from "@/lib/cloudinary";

// export async function POST(req: NextRequest) {
//   const formData = await req.formData();
//   const files = formData.getAll("images") as File[];

//   if (!files || files.length === 0) {
//     return NextResponse.json({ error: "No files provided" }, { status: 400 });
//   }

//   // Optional limits
//   if (files.length > 10) {
//     return NextResponse.json(
//       { error: "Maximum 10 images allowed" },
//       { status: 400 },
//     );
//   }

//   const uploadPromises = files.map(async (file) => {
//     if (!file.type.startsWith("image/")) {
//       throw new Error("Only image files allowed");
//     }

//     const buffer = Buffer.from(await file.arrayBuffer());

//     return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
//       cloudinary.uploader
//         .upload_stream({ folder: "nextjs-uploads" }, (error, result) => {
//           if (error) return reject(error);
//           resolve({
//             url: result!.secure_url,
//             publicId: result!.public_id,
//           });
//         })
//         .end(buffer);
//     });
//   });

//   const results = await Promise.all(uploadPromises);

//   return NextResponse.json({ images: results });
// }

// background upload method
// export async function POST(req: NextRequest) {
//   const formData = await req.formData();
//   const files = formData.getAll("images") as File[];

//   if (!files.length) {
//     return NextResponse.json({ error: "No files" }, { status: 400 });
//   }

//   // Start async upload but don't await
//   (async () => {
//     for (const file of files) {
//       try {
//         const buffer = Buffer.from(await file.arrayBuffer());
//         await new Promise((resolve, reject) => {
//           cloudinary.uploader
//             .upload_stream({ folder: "nextjs-uploads" }, (err, result) => {
//               if (err) return reject(err);
//               resolve(result);
//             })
//             .end(buffer);
//         });
//       } catch (error) {
//         console.error("Upload failed", error);
//       }
//     }
//   })();

//   // Immediately respond to client
//   return NextResponse.json({ status: "upload started" });
// }

// pattern 3 with background task and placeholder urls

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("images") as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const timestamp = Date.now();

  // Generate placeholder public IDs and URLs immediately
  const placeholderData = files.map((file, i) => {
    const publicId = `escorts/${timestamp}-${i}-${file.name.replace(/\s+/g, "_")}`;
    const url = cloudinary.url(publicId, { secure: true });
    return { publicId, url };
  });

  // Fire & forget background upload (no await)
  setTimeout(() => {
    files.forEach(async (file, i) => {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const publicId = placeholderData[i].publicId;

        await new Promise<void>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ public_id: publicId }, (error, result) => {
              if (error) {
                console.error(`❌ Failed to upload ${publicId}`, error);
                return reject(error);
              }
              console.log(`✅ Uploaded: ${publicId}`);
              resolve();
            })
            .end(buffer);
        });
      } catch (error) {
        console.error("Unexpected upload error", error);
      }
    });
  }, 0);

  // Respond immediately with placeholder URLs (201 Created)
  return NextResponse.json(
    { images: placeholderData.map(({ url }) => url) },
    { status: 201 },
  );
}
