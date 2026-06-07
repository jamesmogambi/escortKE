// // app/api/admin/images/status/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { connectToDB } from "@/lib/mongoose";
// import Escort from "@/models/Escort";
//
// export const dynamic = "force-dynamic";
//
// export async function GET(request: NextRequest) {
//   try {
//     await connectToDB();
//
//     const [
//       totalEscorts,
//       escortsWithImages,
//       escortsWithCloudinary,
//       recentMigration,
//     ] = await Promise.all([
//       Escort.countDocuments(),
//       Escort.countDocuments({ images: { $exists: true, $ne: [] } }),
//       Escort.countDocuments({
//         $or: [
//           { images: { $regex: /cloudinary/i } },
//           { imageSource: "cloudinary" },
//         ],
//       }),
//       Escort.findOne({ imageMigrationDate: { $exists: true } })
//         .sort({ imageMigrationDate: -1 })
//         .select("name imageMigrationDate")
//         .lean() as Promise<{ name: string; imageMigrationDate: Date } | null>,
//     ]);
//
//     return NextResponse.json({
//       success: true,
//       stats: {
//         totalEscorts,
//         escortsWithImages,
//         escortsWithCloudinary,
//         migrationProgress:
//           totalEscorts > 0
//             ? Math.round((escortsWithCloudinary / totalEscorts) * 100)
//             : 0,
//         lastMigration: recentMigration
//           ? {
//               escort: recentMigration.name,
//               date: recentMigration.imageMigrationDate,
//             }
//           : null,
//       },
//       cloudinaryConfigured: !!process.env.CLOUDINARY_CLOUD_NAME,
//       timestamp: new Date().toISOString(),
//     });
//   } catch (error: any) {
//     console.error("Status check error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: error.message,
//         message: "Status check failed",
//       },
//       { status: 500 },
//     );
//   }
// }
