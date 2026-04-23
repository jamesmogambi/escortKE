// app/api/migration/fix-failed/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resetFlags = false } = body;

    console.log("🔧 Fixing failed migrations...");

    const escortsRef = collection(db, "escorts");
    const q = query(escortsRef, where("migrationFailed", "==", true));
    const snapshot = await getDocs(q);

    console.log(`📊 Found ${snapshot.size} escorts with failed migration`);

    if (resetFlags) {
      // Reset flags so they can be retried
      let resetCount = 0;
      for (const doc of snapshot.docs) {
        await updateDoc(doc.ref, {
          imagesMigrated: false,
          migrationFailed: false,
          migrationAttemptedAt: null,
          migrationError: null,
        });
        resetCount++;
      }
      console.log(`✅ Reset ${resetCount} escorts for retry`);

      return NextResponse.json({
        success: true,
        message: `Reset ${resetCount} escorts. Run the migration again.`,
        resetCount,
      });
    }

    return NextResponse.json({
      success: true,
      failedEscorts: snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        error: doc.data().migrationError,
      })),
      total: snapshot.size,
      suggestion: "Use resetFlags=true to reset these escorts for retry",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
