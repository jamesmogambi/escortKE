// app/api/agencies/[id]/upload-logo/route.ts
import { NextRequest, NextResponse } from "next/server";
import AgencyImageService from "@/lib/services/agency-image.service";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get("logo") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed",
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

    const result = await AgencyImageService.uploadLogo(id, file);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { url: result.url },
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
    const result = await AgencyImageService.deleteLogo(id);

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Failed to delete logo" },
        { status: 500 },
      );
    }

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
