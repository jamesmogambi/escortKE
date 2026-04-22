// app/api/regions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const county = searchParams.get("county");
    const isActive = searchParams.get("isActive") !== "false";
    const limitCount = parseInt(searchParams.get("limit") || "100");
    const page = parseInt(searchParams.get("page") || "1");

    let constraints = [];

    if (county) {
      constraints.push(where("county", "==", county));
    }

    constraints.push(where("isActive", "==", isActive));
    constraints.push(orderBy("name", "asc"));

    const regionsRef = collection(db, "regions");
    let q = query(regionsRef, ...constraints);

    // Get total count
    const totalSnapshot = await getDocs(q);
    const total = totalSnapshot.size;

    // Apply pagination
    const startAt = (page - 1) * limitCount;
    const paginatedQuery = query(q, limit(limitCount));
    const snapshot = await getDocs(paginatedQuery);

    const regions = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        countyCode: data.countyCode,
        county: data.county,
        countyNumericCode: data.countyNumericCode,
        countyId: data.countyId,
        isActive: data.isActive,
        town: data.town,
        estate: data.estate,
        address: data.address,
        street: data.street,
        postalCode: data.postalCode,
        notes: data.notes,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      };
    });

    return NextResponse.json({
      success: true,
      data: regions,
      pagination: {
        total,
        page,
        limit: limitCount,
        totalPages: Math.ceil(total / limitCount),
        hasMore: page * limitCount < total,
      },
    });
  } catch (error: any) {
    console.error("Error fetching regions:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
