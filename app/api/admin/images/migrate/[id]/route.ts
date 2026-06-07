// // app/api/admin/images/migrate/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import Escort from "@/models/Escort";
// import { cloudinaryMigrationService } from "@/lib/services/cloudinary.service";
//
// export const dynamic = "force-dynamic";
//
// export async function POST(
//   request: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//   try {
//     const { id } = params;
//     const body = await request.json();
//     const { dryRun = false } = body;
//
//     await connectToDB();
//
//     const escort = await Escort.findById(id)
//       .select("_id name images previewPhoto slug")
//       .lean();
//
//     if (!escort) {
//       return NextResponse.json(
//         { success: false, error: "Escort not found" },
//         { status: 404 },
//       );
//     }
//
//     const result = await cloudinaryMigrationService.migrateEscortImages(
//       escort,
//       !dryRun,
//     );
//
//     return NextResponse.json({
//       success: true,
//       message: dryRun ? "Dry run completed" : "Migration completed",
//       result,
//       timestamp: new Date().toISOString(),
//     });
//   } catch (error: any) {
//     console.error("Single escort migration error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: error.message,
//         message: "Migration failed",
//       },
//       { status: 500 },
//     );
//   }
// }
