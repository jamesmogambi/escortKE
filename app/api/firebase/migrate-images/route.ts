// app/api/firebase/migrate-images/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, storage } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export async function POST(request: NextRequest) {
  try {
    let body = {};
    try {
      const text = await request.text();
      body = text ? JSON.parse(text) : {};
    } catch (e) {
      console.log("No JSON body provided, using defaults");
    }

    const { batchSize = 3, startFrom, maxEscorts } = body as any;

    console.log("🚀 Starting image migration...");
    console.log(`Batch size: ${batchSize}`);

    const escortsRef = collection(db, "escorts");
    const snapshot = await getDocs(escortsRef);
    let escorts = snapshot.docs.filter((doc) => {
      const data = doc.data();
      // Only process escorts that have images and haven't been migrated
      return data.images && data.images.length > 0 && !data.imagesMigrated;
    });

    if (maxEscorts) {
      escorts = escorts.slice(0, maxEscorts);
    }

    console.log(`📊 Found ${escorts.length} escorts to process`);

    let startIndex = 0;
    if (startFrom) {
      startIndex = escorts.findIndex((doc) => doc.id === startFrom);
      if (startIndex === -1) startIndex = 0;
    }

    const results = {
      totalProcessed: 0,
      totalImagesUploaded: 0,
      totalImagesFailed: 0,
      totalSkipped: 0,
      details: [] as any[],
    };

    for (let i = startIndex; i < escorts.length; i += batchSize) {
      const batch = escorts.slice(i, i + batchSize);
      console.log(
        `\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(escorts.length / batchSize)}`,
      );

      for (const escortDoc of batch) {
        const data = escortDoc.data();
        const escortId = escortDoc.id;
        const images = data.images || [];

        console.log(`\n📸 Processing ${data.name}: ${images.length} images`);

        const newImageUrls: string[] = [];
        let uploaded = 0;
        let failed = 0;

        for (let j = 0; j < images.length; j++) {
          const imageUrl = images[j];

          if (!imageUrl || !imageUrl.startsWith("http")) {
            console.log(`  ⏭️ Skipping invalid URL: ${imageUrl}`);
            failed++;
            continue;
          }

          try {
            console.log(`  📥 Downloading image ${j + 1}/${images.length}...`);

            // Download image as base64 to avoid blob issues
            const response = await fetch(imageUrl, {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              },
            });

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }

            const contentType = response.headers.get("content-type") || "";
            let extension = "jpg";
            if (contentType.includes("png")) extension = "png";
            else if (contentType.includes("gif")) extension = "gif";
            else if (contentType.includes("webp")) extension = "webp";

            // Convert to base64
            const buffer = await response.arrayBuffer();
            const base64 = Buffer.from(buffer).toString("base64");
            const dataUrl = `data:${contentType};base64,${base64}`;

            // Upload to Firebase Storage using base64 string
            const fileName = `${escortId}/${Date.now()}_${j}.${extension}`;
            const storageRef = ref(storage, `escort-images/${fileName}`);

            await uploadString(storageRef, dataUrl, "data_url");
            const downloadUrl = await getDownloadURL(storageRef);

            newImageUrls.push(downloadUrl);
            uploaded++;
            console.log(`  ✅ Uploaded image ${j + 1}/${images.length}`);
          } catch (error: any) {
            failed++;
            console.error(
              `  ❌ Failed to upload image ${j + 1}:`,
              error.message,
            );
          }

          // Small delay between uploads
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // Update Firestore with new storage URLs
        if (newImageUrls.length > 0) {
          const escortRef = doc(db, "escorts", escortId);
          await updateDoc(escortRef, {
            images: newImageUrls,
            previewPhoto: newImageUrls[0] || data.previewPhoto,
            imagesMigrated: true,
            migratedAt: new Date().toISOString(),
            originalImageCount: images.length,
          });
          console.log(
            `✅ Updated ${data.name}: ${uploaded}/${images.length} images migrated`,
          );
        } else {
          console.log(`⚠️ No images could be migrated for ${data.name}`);
        }

        results.totalProcessed++;
        results.totalImagesUploaded += uploaded;
        results.totalImagesFailed += failed;
        results.details.push({
          id: escortId,
          name: data.name,
          original: images.length,
          uploaded,
          failed,
        });
      }

      // Wait between batches
      if (i + batchSize < escorts.length) {
        console.log("\n⏳ Waiting 5 seconds before next batch...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("📊 MIGRATION SUMMARY");
    console.log("=".repeat(50));
    console.log(`Total escorts processed: ${results.totalProcessed}`);
    console.log(`Total images uploaded: ${results.totalImagesUploaded}`);
    console.log(`Total images failed: ${results.totalImagesFailed}`);
    console.log("=".repeat(50));

    return NextResponse.json({
      success: true,
      message: "Image migration completed",
      results,
    });
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const batchSize = parseInt(searchParams.get("batchSize") || "3");
  const maxEscorts = parseInt(searchParams.get("maxEscorts") || "5");

  const mockBody = {
    batchSize,
    maxEscorts: maxEscorts || undefined,
  };

  const mockRequest = {
    json: async () => mockBody,
    text: async () => JSON.stringify(mockBody),
  } as NextRequest;

  return POST(mockRequest);
}
