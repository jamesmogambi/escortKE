// app/api/agencies/[id]/escorts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { EscortModel } from "@/lib/models/escort.model";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// Create a new escort for an agency
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id: agencyId } = await params;

    // Verify agency exists
    const agencyRef = doc(db, "agencies", agencyId);
    const agencyDoc = await getDoc(agencyRef);

    if (!agencyDoc.exists()) {
      return NextResponse.json(
        { success: false, error: "Agency not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const escort = await EscortModel.create(body, agencyId);

    return NextResponse.json({
      success: true,
      data: escort,
      message: "Escort added to agency successfully",
    });
  } catch (error: any) {
    console.error("Error creating agency escort:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// Get all escorts belonging to an agency
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id: agencyId } = await params;
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const isAvailable = searchParams.get("isAvailable") === "true";
    const isVerified = searchParams.get("isVerified") === "true";
    const minAge = parseInt(searchParams.get("minAge") || "0");
    const maxAge = parseInt(searchParams.get("maxAge") || "100");
    const search = searchParams.get("search") || "";

    // Verify agency exists
    const agencyRef = doc(db, "agencies", agencyId);
    const agencyDoc = await getDoc(agencyRef);

    if (!agencyDoc.exists()) {
      return NextResponse.json(
        { success: false, error: "Agency not found" },
        { status: 404 },
      );
    }

    const { escorts, total, hasMore } = await EscortModel.getAll({
      agencyId,
      page,
      limit,
      isAvailable,
      isVerified,
      minAge,
      maxAge,
    });

    // Filter by search term if provided
    let filteredEscorts = escorts;
    if (search) {
      filteredEscorts = escorts.filter(
        (escort) =>
          escort.name.toLowerCase().includes(search.toLowerCase()) ||
          escort.nationality?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredEscorts,
      pagination: {
        total: filteredEscorts.length,
        page,
        limit,
        hasMore,
      },
    });
  } catch (error: any) {
    console.error("Error fetching agency escorts:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
