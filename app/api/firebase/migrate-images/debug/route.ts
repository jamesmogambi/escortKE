// app/api/firebase/migrate-images/debug/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const escortsRef = collection(db, "escorts");
    const snapshot = await getDocs(escortsRef);

    const stats = {
      totalEscorts: snapshot.size,
      withImages: 0,
      alreadyMigrated: 0,
      needsMigration: 0,
      sampleEscorts: [] as any[],
    };

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const hasImages = data.images && data.images.length > 0;
      const isMigrated = data.imagesMigrated === true;

      if (hasImages) {
        stats.withImages++;
        if (isMigrated) {
          stats.alreadyMigrated++;
        } else {
          stats.needsMigration++;
          // Store first 5 escorts that need migration as sample
          if (stats.sampleEscorts.length < 5) {
            stats.sampleEscorts.push({
              id: doc.id,
              name: data.name,
              imageCount: data.images.length,
              imagesMigrated: data.imagesMigrated,
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      stats,
      message:
        stats.needsMigration === 0
          ? "No escorts need migration. Use /reset endpoint to reset migration flags if needed."
          : `${stats.needsMigration} escorts are ready for migration.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
