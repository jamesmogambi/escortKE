// app/api/agencies/[id]/upload-logo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { storage, db } from "@/lib/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    // Check content type to determine how to parse the request
    const contentType = request.headers.get("content-type") || "";

    let file: File | null = null;
    let base64Data: string | null = null;

    // Handle multipart/form-data (file upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      file = formData.get("logo") as File;

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No file provided" },
          { status: 400 },
        );
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed",
          },
          { status: 400 },
        );
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "File size too large. Max 5MB" },
          { status: 400 },
        );
      }
    }
    // Handle application/json (base64 string)
    else if (contentType.includes("application/json")) {
      const body = await request.json();
      base64Data = body.logo || body.image || body.base64;

      if (!base64Data) {
        return NextResponse.json(
          { success: false, error: "No image data provided" },
          { status: 400 },
        );
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          error:
            "Content-Type must be 'multipart/form-data' or 'application/json'",
        },
        { status: 400 },
      );
    }

    // Check if agency exists
    const agencyRef = doc(db, "agencies", id);
    const agencyDoc = await getDoc(agencyRef);

    if (!agencyDoc.exists()) {
      return NextResponse.json(
        { success: false, error: "Agency not found" },
        { status: 404 },
      );
    }

    // Upload to Firebase Storage
    let downloadUrl: string;
    let buffer: Buffer;
    let mimeType: string;

    if (file) {
      // Handle file upload
      const extension = file.name.split(".").pop();
      const fileName = `logo_${Date.now()}.${extension}`;
      const storagePath = `agencies/${id}/logo/${fileName}`;
      const storageRef = ref(storage, storagePath);

      buffer = Buffer.from(await file.arrayBuffer());
      mimeType = file.type;

      await uploadBytes(storageRef, buffer, { contentType: mimeType });
      downloadUrl = await getDownloadURL(storageRef);
    } else if (base64Data) {
      // Handle base64 upload
      // Remove data URL prefix if present
      const base64String = base64Data.replace(/^data:image\/\w+;base64,/, "");
      const matches = base64Data.match(/^data:image\/(\w+);base64,/);
      const extension = matches ? matches[1] : "jpg";
      const fileName = `logo_${Date.now()}.${extension}`;
      const storagePath = `agencies/${id}/logo/${fileName}`;
      const storageRef = ref(storage, storagePath);

      buffer = Buffer.from(base64String, "base64");
      mimeType = `image/${extension === "jpg" ? "jpeg" : extension}`;

      await uploadBytes(storageRef, buffer, { contentType: mimeType });
      downloadUrl = await getDownloadURL(storageRef);
    } else {
      return NextResponse.json(
        { success: false, error: "No valid image data provided" },
        { status: 400 },
      );
    }

    // Delete old logo if exists
    const agency = agencyDoc.data();
    if (agency.logo) {
      try {
        const oldUrlPath = agency.logo.split("/o/")[1]?.split("?")[0];
        if (oldUrlPath) {
          const decodedPath = decodeURIComponent(oldUrlPath);
          const oldRef = ref(storage, decodedPath);
          await deleteObject(oldRef);
        }
      } catch (error) {
        console.error("Error deleting old logo:", error);
      }
    }

    // Update agency document
    await updateDoc(agencyRef, {
      logo: downloadUrl,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: { url: downloadUrl },
      message: "Logo uploaded successfully",
    });
  } catch (error: any) {
    console.error("Error uploading logo:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const agencyRef = doc(db, "agencies", id);
    const agencyDoc = await getDoc(agencyRef);

    if (!agencyDoc.exists()) {
      return NextResponse.json(
        { success: false, error: "Agency not found" },
        { status: 404 },
      );
    }

    const agency = agencyDoc.data();

    // Delete from storage if logo exists
    if (agency.logo) {
      const urlPath = agency.logo.split("/o/")[1]?.split("?")[0];
      if (urlPath) {
        const decodedPath = decodeURIComponent(urlPath);
        const fileRef = ref(storage, decodedPath);
        await deleteObject(fileRef);
      }
    }

    // Update agency document
    await updateDoc(agencyRef, {
      logo: "",
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Logo deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting logo:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
