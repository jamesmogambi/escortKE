// app/api/agencies/[id]/escorts/[escortId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { EscortModel } from "@/lib/models/escort.model";
import { getAuth } from "firebase-admin/auth";
// import { initAdmin } from "@/lib/firebase-admin";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// initAdmin();

// Get a specific escort from an agency
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; escortId: string } },
) {
  try {
    const { id: agencyId, escortId } = await params;

    const escort = await EscortModel.getById(escortId);

    if (!escort) {
      return NextResponse.json(
        { success: false, error: "Escort not found" },
        { status: 404 },
      );
    }

    if (escort.agencyId !== agencyId) {
      return NextResponse.json(
        { success: false, error: "Escort does not belong to this agency" },
        { status: 403 },
      );
    }

    return NextResponse.json({
      success: true,
      data: escort,
    });
  } catch (error: any) {
    console.error("Error fetching escort:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// Update an escort in an agency
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; escortId: string } },
) {
  try {
    const { id: agencyId, escortId } = await params;

    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Verify agency ownership
    const agencyRef = doc(db, "agencies", agencyId);
    const agencyDoc = await getDoc(agencyRef);

    if (!agencyDoc.exists()) {
      return NextResponse.json(
        { success: false, error: "Agency not found" },
        { status: 404 },
      );
    }

    const agency = agencyDoc.data();
    if (agency.ownerId !== userId && !decodedToken.admin) {
      return NextResponse.json(
        {
          success: false,
          error: "You don't have permission to update escorts in this agency",
        },
        { status: 403 },
      );
    }

    // Verify escort belongs to agency
    const escort = await EscortModel.getById(escortId);
    if (!escort) {
      return NextResponse.json(
        { success: false, error: "Escort not found" },
        { status: 404 },
      );
    }

    if (escort.agencyId !== agencyId) {
      return NextResponse.json(
        { success: false, error: "Escort does not belong to this agency" },
        { status: 403 },
      );
    }

    const body = await request.json();
    await EscortModel.update(escortId, body);

    return NextResponse.json({
      success: true,
      message: "Escort updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating escort:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// Remove an escort from an agency (delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; escortId: string } },
) {
  try {
    const { id: agencyId, escortId } = await params;

    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Verify agency ownership
    const agencyRef = doc(db, "agencies", agencyId);
    const agencyDoc = await getDoc(agencyRef);

    if (!agencyDoc.exists()) {
      return NextResponse.json(
        { success: false, error: "Agency not found" },
        { status: 404 },
      );
    }

    const agency = agencyDoc.data();
    if (agency.ownerId !== userId && !decodedToken.admin) {
      return NextResponse.json(
        {
          success: false,
          error: "You don't have permission to remove escorts from this agency",
        },
        { status: 403 },
      );
    }

    // Verify escort belongs to agency
    const escort = await EscortModel.getById(escortId);
    if (!escort) {
      return NextResponse.json(
        { success: false, error: "Escort not found" },
        { status: 404 },
      );
    }

    if (escort.agencyId !== agencyId) {
      return NextResponse.json(
        { success: false, error: "Escort does not belong to this agency" },
        { status: 403 },
      );
    }

    await EscortModel.delete(escortId);

    return NextResponse.json({
      success: true,
      message: "Escort removed from agency successfully",
    });
  } catch (error: any) {
    console.error("Error deleting escort:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
