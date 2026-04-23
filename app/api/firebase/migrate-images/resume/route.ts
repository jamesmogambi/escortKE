// app/api/firebase/migrate-images/resume/route.ts
import { NextResponse } from "next/server";
import { migrationQueue } from "@/lib/migration.queue";

export async function POST() {
  const result = await migrationQueue.resumeMigration();
  return NextResponse.json(result);
}

// // app/api/migration/resume/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db, storage } from "@/lib/firebase";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   doc,
//   updateDoc,
// } from "firebase/firestore";
// import { ref, uploadString, getDownloadURL } from "firebase/storage";

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const {
//       batchSize = 10,
//       startFrom,
//       onlyFailed = false,
//       maxEscorts = 100,
//     } = body;

//     console.log("🔄 Resuming image migration...");

//     // Get escorts that need migration
//     let constraints = [];

//     if (onlyFailed) {
//       // Only get escorts that failed previously
//       constraints.push(where("migrationFailed", "==", true));
//     } else {
//       // Get escorts not yet migrated
//       constraints.push(where("imagesMigrated", "!=", true));
//     }

//     constraints.push(where("images", "!=", []));

//     const escortsRef = collection(db, "escorts");
//     const q = query(escortsRef, ...constraints);
//     const snapshot = await getDocs(q);

//     let escorts = snapshot.docs;

//     // Filter to only those with images
//     escorts = escorts.filter((doc) => {
//       const data = doc.data();
//       return data.images && data.images.length > 0;
//     });

//     // Apply max limit
//     if (maxEscorts) {
//       escorts = escorts.slice(0, maxEscorts);
//     }

//     // Start from specific escort if provided
//     let startIndex = 0;
//     if (startFrom) {
//       startIndex = escorts.findIndex((doc) => doc.id === startFrom);
//       if (startIndex === -1) startIndex = 0;
//     }

//     console.log(`📊 Found ${escorts.length} escorts needing migration`);
//     console.log(`📦 Batch size: ${batchSize}`);

//     const results = {
//       processed: 0,
//       succeeded: 0,
//       failed: 0,
//       totalImages: 0,
//       uploadedImages: 0,
//       failedImages: 0,
//       details: [] as any[],
//     };

//     // Process in batches
//     for (let i = startIndex; i < escorts.length; i += batchSize) {
//       const batch = escorts.slice(i, i + batchSize);
//       console.log(
//         `\n📝 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(escorts.length / batchSize)}`,
//       );

//       for (const escortDoc of batch) {
//         const data = escortDoc.data();
//         const escortId = escortDoc.id;
//         const images = data.images || [];

//         console.log(`\n📸 Processing: ${data.name}`);
//         console.log(`   ID: ${escortId}`);
//         console.log(`   Images: ${images.length}`);

//         const newImageUrls: string[] = [];
//         let uploaded = 0;
//         let failed = 0;

//         for (let j = 0; j < images.length; j++) {
//           const imageUrl = images[j];

//           if (!imageUrl || !imageUrl.startsWith("http")) {
//             console.log(`   ⏭️ Skipping invalid URL: ${imageUrl}`);
//             failed++;
//             continue;
//           }

//           try {
//             console.log(`   📥 Downloading image ${j + 1}/${images.length}...`);

//             const response = await fetch(imageUrl, {
//               headers: {
//                 "User-Agent":
//                   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
//               },
//             });

//             if (!response.ok) {
//               throw new Error(`HTTP ${response.status}`);
//             }

//             const contentType = response.headers.get("content-type") || "";
//             let extension = "jpg";
//             if (contentType.includes("png")) extension = "png";
//             else if (contentType.includes("gif")) extension = "gif";
//             else if (contentType.includes("webp")) extension = "webp";

//             const buffer = await response.arrayBuffer();
//             const base64 = Buffer.from(buffer).toString("base64");
//             const dataUrl = `data:${contentType};base64,${base64}`;

//             const fileName = `${escortId}/${Date.now()}_${j}.${extension}`;
//             const storageRef = ref(storage, `escort-images/${fileName}`);

//             await uploadString(storageRef, dataUrl, "data_url");
//             const downloadUrl = await getDownloadURL(storageRef);

//             newImageUrls.push(downloadUrl);
//             uploaded++;

//             console.log(`   ✅ Uploaded image ${j + 1}/${images.length}`);
//           } catch (error: any) {
//             failed++;
//             console.error(`   ❌ Failed: ${error.message}`);
//           }

//           await new Promise((resolve) => setTimeout(resolve, 500));
//         }

//         // Update Firestore
//         if (newImageUrls.length > 0) {
//           const escortRef = doc(db, "escorts", escortId);
//           await updateDoc(escortRef, {
//             images: newImageUrls,
//             previewPhoto: newImageUrls[0] || data.previewPhoto,
//             imagesMigrated: true,
//             migratedAt: new Date().toISOString(),
//             originalImageCount: images.length,
//             uploadedImagesCount: uploaded,
//             failedImagesCount: failed,
//             migrationCompleted: true,
//           });
//           console.log(
//             `   ✅ Updated: ${uploaded}/${images.length} images migrated`,
//           );
//         } else if (images.length > 0) {
//           // Mark as failed for retry
//           const escortRef = doc(db, "escorts", escortId);
//           await updateDoc(escortRef, {
//             migrationFailed: true,
//             migrationAttemptedAt: new Date().toISOString(),
//             migrationError: "No images could be uploaded",
//           });
//           console.log(`   ❌ Failed: No images could be migrated`);
//         }

//         results.processed++;
//         results.succeeded += uploaded > 0 ? 1 : 0;
//         results.failed += uploaded === 0 ? 1 : 0;
//         results.totalImages += images.length;
//         results.uploadedImages += uploaded;
//         results.failedImages += failed;
//         results.details.push({
//           id: escortId,
//           name: data.name,
//           originalImages: images.length,
//           uploaded,
//           failed,
//         });
//       }

//       // Save progress
//       console.log(
//         `\n📊 Progress: ${results.processed}/${escorts.length} escorts`,
//       );
//       console.log(
//         `📸 Images: ${results.uploadedImages}/${results.totalImages} uploaded`,
//       );

//       // Wait between batches
//       if (i + batchSize < escorts.length) {
//         console.log("⏳ Waiting 3 seconds before next batch...");
//         await new Promise((resolve) => setTimeout(resolve, 3000));
//       }
//     }

//     console.log("\n" + "=".repeat(50));
//     console.log("📊 MIGRATION RESUME SUMMARY");
//     console.log("=".repeat(50));
//     console.log(`✅ Processed: ${results.processed}`);
//     console.log(`✅ Succeeded: ${results.succeeded}`);
//     console.log(`❌ Failed: ${results.failed}`);
//     console.log(
//       `📸 Images uploaded: ${results.uploadedImages}/${results.totalImages}`,
//     );
//     console.log("=".repeat(50));

//     return NextResponse.json({
//       success: true,
//       message: "Migration resumed successfully",
//       results,
//     });
//   } catch (error: any) {
//     console.error("Migration error:", error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 },
//     );
//   }
// }
