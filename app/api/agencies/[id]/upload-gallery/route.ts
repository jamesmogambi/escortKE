// app/api/agencies/[id]/upload-gallery/route.ts
import { NextRequest, NextResponse } from "next/server";
import AgencyImageService from "@/lib/services/agency-image.service";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const files = formData.getAll("gallery") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided" },
        { status: 400 },
      );
    }

    // Validate files
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxFiles = 20;
    const maxFileSize = 5 * 1024 * 1024; // 5MB per file

    if (files.length > maxFiles) {
      return NextResponse.json(
        { success: false, error: `Maximum ${maxFiles} files allowed` },
        { status: 400 },
      );
    }

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid file type: ${file.name}. Only JPEG, PNG, GIF, and WEBP are allowed`,
          },
          { status: 400 },
        );
      }

      if (file.size > maxFileSize) {
        return NextResponse.json(
          {
            success: false,
            error: `File ${file.name} is too large. Max 5MB per file`,
          },
          { status: 400 },
        );
      }
    }

    const results = await AgencyImageService.uploadGalleryImages(id, files);
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    return NextResponse.json({
      success: true,
      data: {
        uploaded: successful.map((r) => r.url),
        failed: failed.length,
        total: results.length,
      },
      message: `${successful.length} images uploaded successfully`,
    });
  } catch (error: any) {
    console.error("Error uploading gallery images:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
