// app/api/agencies/[id]/escorts/[escortId]/upload-gallery/route.ts
import { NextRequest, NextResponse } from "next/server";
import { EscortModel } from "@/lib/models/escort.model";
import { getAuth } from "firebase-admin/auth";
// import { initAdmin } from "@/lib/firebase-admin";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// initAdmin();

export async function POST(
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
          error:
            "You don't have permission to upload images for escorts in this agency",
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

    const formData = await request.formData();
    const files = formData.getAll("gallery") as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided" },
        { status: 400 },
      );
    }

    const uploadedUrls = await EscortModel.uploadGallery(
      escortId,
      files,
      agencyId,
    );

    return NextResponse.json({
      success: true,
      data: { uploaded: uploadedUrls },
      message: `${uploadedUrls.length} images uploaded successfully`,
    });
  } catch (error: any) {
    console.error("Error uploading gallery:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
