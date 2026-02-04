// app/api/admin/images/migrate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cloudinaryMigrationService } from "@/lib/services/cloudinary.service";

export const maxDuration = 300; // 5 minutes for longer migrations
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Check authentication (add your auth logic here)
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { limit = 10, skip = 0, dryRun = false, batchSize = 3 } = body;

    // Validate Cloudinary config
    if (!cloudinaryMigrationService.isConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cloudinary is not configured. Please check environment variables.",
        },
        { status: 500 },
      );
    }

    // Set batch size
    cloudinaryMigrationService.setBatchSize(batchSize);

    console.log("Starting image migration with params:", {
      limit,
      skip,
      dryRun,
      batchSize,
    });

    const stats = await cloudinaryMigrationService.migrateAllEscorts(
      limit,
      skip,
      !dryRun,
    );

    return NextResponse.json({
      success: true,
      message: dryRun ? "Dry run completed" : "Migration completed",
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("API Migration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: "Migration failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
