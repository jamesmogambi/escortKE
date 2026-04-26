// app/api/agencies/featured/route.ts (Get featured agencies)
import { NextRequest, NextResponse } from "next/server";
import AgencyService from "@/lib/services/agency.service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");

    const agencies = await AgencyService.getFeaturedAgencies(limit);

    return NextResponse.json({
      success: true,
      data: agencies,
    });
  } catch (error: any) {
    console.error("Error fetching featured agencies:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// app/api/agencies/featured/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import {
//   collection,
//   query,
//   where,
//   orderBy,
//   limit,
//   getDocs,
// } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// // import { db } from "@/lib/firebase/config";

// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams;
//     const limit_count = parseInt(searchParams.get("limit") || "10", 10);

//     const featuredQuery = query(
//       collection(db, "agencies"),
//       where("isActive", "==", true),
//       where("isFeatured", "==", true),
//       orderBy("rating", "desc"),
//       limit(limit_count),
//     );

//     const featuredSnapshot = await getDocs(featuredQuery);

//     const featuredAgencies = featuredSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//       createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
//     }));

//     return NextResponse.json({
//       success: true,
//       data: {
//         agencies: featuredAgencies,
//         count: featuredAgencies.length,
//       },
//       message: "Featured agencies retrieved successfully",
//     });
//   } catch (error: any) {
//     console.error("Error fetching featured agencies:", error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 },
//     );
//   }
// }
