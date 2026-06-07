import {NextResponse} from "next/server";
import {adminDb} from "@/lib/firebase-admin";
import escortsData from "./escortDB.escorts.json";

// Type definitions
interface MongoId {
    $oid: string;
}

interface Location {
    region: MongoId | string;
    town: string;
    estate: string;
    address: string;
    street: string;
    postalCode: string;
    isActive: boolean;
    notes: string;
    _id: MongoId | string;
}

interface Rate {
    duration: string;
    incall: string;
    outcall: string;
    _id?: MongoId | string;
}

interface OpeningHours {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
}

interface Plan {
    type: string;
    isActive: boolean;
    features: string[];
}

interface Escort {
    _id: MongoId;
    name: string;
    username: string;
    previewPhoto: string;
    labels: string[];
    email: string;
    age: string;
    telephone: string;
    whatsappPhone: string;
    images: string[];
    videos: string[];
    about: string;
    availability: string[];
    ethnicity: string;
    nationality: string;
    bustSize: string;
    weight: string;
    zodiacSign: string;
    sexualOrientation: string;
    gender: string;
    languages: string[];
    categories: string[];
    country: string;
    county: MongoId | string;
    countyCode: string;
    regions: (MongoId | string)[];
    primaryRegion: MongoId | string;
    locations: Location[];
    source: string;
    practices: string[];
    bdsm: string[];
    massage: string[];
    extraServices: string[];
    slug: string;
    role: string;
    openingHours: OpeningHours;
    rates: Rate[];
    breastSize: string;
    ageCategory: string;
    character: string;
    hairColor: string;
    experience: string;
    workType: string;
    isAgencyFeatured: boolean;
    isActive: boolean;
    isVerified: boolean;
    isFeatured: boolean;
    plan: Plan;
    totalBookings: number;
    totalReviews: number;
    rating: number;
    totalViews: number;
    createdAt: { $date: string };
    updatedAt: { $date: string };
    __v?: number;
}

// Helper function to extract string ID from MongoDB ObjectId
const extractId = (id: MongoId | string | undefined): string => {
    if (!id) return "";
    if (typeof id === "string") return id;
    return id.$oid;
};

// Helper function to clean MongoDB-specific fields
const cleanEscortData = (escort: Escort) => {
    const {_id, __v, ...escortData} = escort;

    // Convert date strings to Date objects
    const cleanData = {
        ...escortData,
        createdAt: new Date(escortData.createdAt.$date),
        updatedAt: new Date(escortData.updatedAt.$date),
        county: extractId(escortData.county),
        primaryRegion: extractId(escortData.primaryRegion),
        regions: escortData.regions.map((region) => extractId(region)),
        locations: escortData.locations.map((location) => ({
            ...location,
            region: extractId(location.region),
            _id: extractId(location._id),
        })),
        rates: escortData.rates.map((rate) => ({
            ...rate,
            _id: rate._id ? extractId(rate._id) : undefined,
        })),
    };

    return cleanData;
};

export async function POST(request: Request) {
    try {
        // Security check - only allow in development
        if (process.env.NODE_ENV !== "development") {
            return NextResponse.json(
                {error: "Seeding only allowed in development environment"},
                {status: 403},
            );
        }

        // Ensure data is an array
        const escorts = Array.isArray(escortsData) ? escortsData : [escortsData];

        console.log(`📊 Processing ${escorts.length} escorts...`);

        let added = 0;
        let skipped = 0;
        let errors = 0;

        // Use Firestore batch with Admin SDK
        const batch = adminDb.batch();
        let batchCount = 0;
        const BATCH_LIMIT = 500;

        for (const escort of escorts) {
            try {
                // Validate required fields
                if (!escort.name || !escort.username) {
                    console.error(`❌ Invalid escort data: missing name or username`);
                    errors++;
                    continue;
                }

                // Get document ID from MongoDB _id
                const docId = extractId(escort._id);

                if (!docId) {
                    console.error(`❌ Invalid document ID for ${escort.name}`);
                    errors++;
                    continue;
                }

                // Check if escort already exists using Admin SDK
                const existingDoc = await adminDb
                    .collection("escorts")
                    .doc(docId)
                    .get();

                if (existingDoc.exists) {
                    console.log(`⚠️ Skipping ${escort.name} (${docId}) - already exists`);
                    skipped++;
                    continue;
                }

                // Clean the data
                const cleanData = cleanEscortData(escort);

                // Add to batch
                const docRef = adminDb.collection("escorts").doc(docId);
                batch.set(docRef, cleanData);

                batchCount++;
                added++;

                // Commit batch when limit reached
                if (batchCount >= BATCH_LIMIT) {
                    await batch.commit();
                    console.log(`📦 Committed batch of ${batchCount} escorts`);
                    batchCount = 0;
                }

                console.log(
                    `✅ Added: ${escort.name} (${escort.age} yrs, ${escort.nationality})`,
                );
            } catch (error) {
                console.error(`❌ Error processing ${escort.name}:`, error);
                errors++;
            }
        }

        // Commit remaining
        if (batchCount > 0) {
            await batch.commit();
            console.log(`📦 Committed final batch of ${batchCount} escorts`);
        }

        return NextResponse.json({
            success: true,
            stats: {
                added,
                skipped,
                errors,
                total: escorts.length,
            },
            message: `Successfully added ${added} escorts to Firestore`,
        });
    } catch (error) {
        console.error("Seeding failed:", error);
        return NextResponse.json(
            {
                error: "Failed to seed escorts",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            {status: 500},
        );
    }
}

// GET endpoint to check seeded data
export async function GET() {
    try {
        // Security check - only allow in development
        if (process.env.NODE_ENV !== "development") {
            return NextResponse.json(
                {error: "This endpoint is only available in development environment"},
                {status: 403},
            );
        }

        const snapshot = await adminDb.collection("escorts").limit(10).get();
        const totalSnapshot = await adminDb.collection("escorts").get();
        const totalCount = totalSnapshot.size;

        const escorts = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            age: doc.data().age,
            nationality: doc.data().nationality,
            location: doc.data().locations?.[0]?.town,
            isActive: doc.data().isActive,
            createdAt: doc.data().createdAt,
        }));

        return NextResponse.json({
            success: true,
            stats: {
                total: totalCount,
                sampleSize: escorts.length,
            },
            data: escorts,
        });
    } catch (error) {
        console.error("Failed to fetch escorts:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch escorts",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            {status: 500},
        );
    }
}

// DELETE endpoint to clear all escorts
export async function DELETE() {
    try {
        // Security check - only allow in development
        if (process.env.NODE_ENV !== "development") {
            return NextResponse.json(
                {error: "This endpoint is only available in development environment"},
                {status: 403},
            );
        }

        const snapshot = await adminDb.collection("escorts").get();
        const totalToDelete = snapshot.size;

        if (totalToDelete === 0) {
            return NextResponse.json({
                success: true,
                message: "No escorts to delete",
                deletedCount: 0,
            });
        }

        // Delete in batches
        const batch = adminDb.batch();
        let batchCount = 0;
        let deletedCount = 0;
        const BATCH_LIMIT = 500;

        for (const doc of snapshot.docs) {
            batch.delete(doc.ref);
            batchCount++;
            deletedCount++;

            if (batchCount >= BATCH_LIMIT) {
                await batch.commit();
                console.log(`📦 Deleted batch of ${batchCount} escorts`);
                batchCount = 0;
            }
        }

        if (batchCount > 0) {
            await batch.commit();
            console.log(`📦 Deleted final batch of ${batchCount} escorts`);
        }

        console.log(`✅ Successfully deleted ${deletedCount} escorts`);

        return NextResponse.json({
            success: true,
            message: `Successfully deleted ${deletedCount} escorts`,
            deletedCount,
        });
    } catch (error) {
        console.error("Failed to delete escorts:", error);
        return NextResponse.json(
            {
                error: "Failed to delete escorts",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            {status: 500},
        );
    }
}
