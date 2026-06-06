import {NextResponse} from "next/server";
import {adminDb} from "@/lib/firebase-admin";

export async function GET() {
    try {
        // We want to find escorts where images array is empty AND previewPhoto is missing/empty
        // Firestore limited query capabilities for "empty array" means we might need to fetch and filter
        // OR if there's a large amount of data, we should have indexed these.
        // For now, let's fetch them and filter.
        // Optimization: if we know common values for "no image", we can use .where()

        const snapshot = await adminDb.collection("escorts").get();

        const escortsWithoutImages = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter((escort: any) => {
                const hasNoImagesArray = !escort.images || escort.images.length === 0;
                const hasNoPreviewPhoto = !escort.previewPhoto || escort.previewPhoto === "" || escort.previewPhoto === "null";
                return hasNoImagesArray && hasNoPreviewPhoto;
            });

        return NextResponse.json({
            success: true,
            count: escortsWithoutImages.length,
            data: escortsWithoutImages
        });
    } catch (error) {
        console.error("Failed to fetch escorts without images:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch escorts",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            {status: 500}
        );
    }
}

export async function DELETE() {
    try {
        const snapshot = await adminDb.collection("escorts").get();

        const toDelete = snapshot.docs.filter((doc) => {
            const escort = doc.data();
            const hasNoImagesArray = !escort.images || escort.images.length === 0;
            const hasNoPreviewPhoto = !escort.previewPhoto || escort.previewPhoto === "" || escort.previewPhoto === "null";
            return hasNoImagesArray && hasNoPreviewPhoto;
        });

        if (toDelete.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No escorts without images found to delete",
                count: 0
            });
        }

        const BATCH_LIMIT = 500;
        let deletedCount = 0;

        // Process in batches
        for (let i = 0; i < toDelete.length; i += BATCH_LIMIT) {
            const batch = adminDb.batch();
            const chunk = toDelete.slice(i, i + BATCH_LIMIT);

            chunk.forEach((doc) => {
                batch.delete(doc.ref);
                deletedCount++;
            });

            await batch.commit();
        }

        return NextResponse.json({
            success: true,
            message: `Successfully deleted ${deletedCount} escorts without images`,
            count: deletedCount
        });
    } catch (error) {
        console.error("Failed to delete escorts without images:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to delete escorts",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            {status: 500}
        );
    }
}
