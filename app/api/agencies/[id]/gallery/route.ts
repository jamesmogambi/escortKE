// app/api/agencies/[id]/upload-gallery/route.ts
import { NextRequest, NextResponse } from "next/server";
import AgencyImageService from "@/lib/services/agency-image.service";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { deleteObject, ref } from "firebase/storage";

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

// app/api/agencies/[id]/gallery/route.ts (DELETE method)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const { indexes } = await request.json(); // Expect { indexes: [0, 2, 5] }

    if (!indexes || !Array.isArray(indexes) || indexes.length === 0) {
      return NextResponse.json(
        { success: false, error: "No indexes provided" },
        { status: 400 },
      );
    }

    // Get agency data
    const agencyRef = doc(db, "agencies", id);
    const agencyDoc = await getDoc(agencyRef);

    if (!agencyDoc.exists()) {
      return NextResponse.json(
        { success: false, error: "Agency not found" },
        { status: 404 },
      );
    }

    const agency = agencyDoc.data();
    const currentGallery = Array.isArray(agency.gallery) ? agency.gallery : [];

    // Validate indexes
    const validIndexes = indexes.filter(
      (idx) => idx >= 0 && idx < currentGallery.length,
    );
    const invalidIndexes = indexes.filter(
      (idx) => idx < 0 || idx >= currentGallery.length,
    );

    if (validIndexes.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid indexes provided",
          invalidIndexes,
        },
        { status: 400 },
      );
    }

    // Sort indexes descending to delete from end first
    const sortedIndexes = [...validIndexes].sort((a, b) => b - a);

    // Get URLs of images to delete
    const urlsToDelete = sortedIndexes.map((idx) => currentGallery[idx]);

    // Delete from storage
    const deletionResults = [];
    for (const url of urlsToDelete) {
      try {
        const decodedUrl = decodeURIComponent(url);
        const pathMatch = decodedUrl.match(/\/o\/(.+?)\?/);

        if (pathMatch && pathMatch[1]) {
          const storagePath = decodeURIComponent(pathMatch[1]);
          const storageRef = ref(storage, storagePath);
          await deleteObject(storageRef);
          deletionResults.push({ url, success: true });
        }
      } catch (error: any) {
        deletionResults.push({ url, success: false, error: error.message });
      }
    }

    // Remove images by indexes
    let newGallery = [...currentGallery];
    for (const idx of sortedIndexes) {
      newGallery = [...newGallery.slice(0, idx), ...newGallery.slice(idx + 1)];
    }

    // Update Firestore
    await updateDoc(agencyRef, {
      gallery: newGallery,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: {
        deletedCount: validIndexes.length,
        invalidIndexes,
        deletionResults,
        remainingImages: newGallery.length,
      },
      message: `Deleted ${validIndexes.length} images successfully`,
    });
  } catch (error: any) {
    console.error("Error deleting gallery images by indexes:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    // Get query parameters for pagination and filtering
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const includeMetadata = searchParams.get("includeMetadata") === "true";

    // Get agency data
    const agencyRef = doc(db, "agencies", id);
    const agencyDoc = await getDoc(agencyRef);

    if (!agencyDoc.exists()) {
      return NextResponse.json(
        { success: false, error: "Agency not found" },
        { status: 404 },
      );
    }

    const agency = agencyDoc.data();
    const gallery = Array.isArray(agency.gallery) ? agency.gallery : [];
    const totalImages = gallery.length;

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedGallery = gallery.slice(startIndex, endIndex);

    // Prepare response data
    const responseData: any = {
      success: true,
      data: {
        images: paginatedGallery,
        total: totalImages,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(totalImages / limit),
          hasNext: endIndex < totalImages,
          hasPrev: startIndex > 0,
        },
      },
    };

    // Include metadata if requested
    if (includeMetadata && paginatedGallery.length > 0) {
      responseData.data.metadata = {
        lastUpdated: agency.updatedAt || agency.createdAt,
        galleryType: "agency_gallery",
      };
    }

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("Error fetching agency gallery:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
