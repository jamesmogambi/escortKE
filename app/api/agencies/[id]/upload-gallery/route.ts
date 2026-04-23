// app/api/agencies/[id]/upload-gallery/route.ts
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

    // Debug: Log all headers
    console.log("All headers:", Object.fromEntries(request.headers.entries()));

    // Get content type
    const contentType = request.headers.get("content-type") || "";
    console.log("Received Content-Type:", contentType);

    let files: File[] = [];
    let base64Images: string[] = [];

    // Handle multipart/form-data (file upload)
    if (
      contentType.includes("multipart/form-data") ||
      contentType.includes("form-data")
    ) {
      try {
        const formData = await request.formData();
        const uploadedFiles = formData.getAll("gallery") as File[];
        files = uploadedFiles.filter((file) => file && file.size > 0);

        if (files.length === 0) {
          return NextResponse.json(
            { success: false, error: "No files provided" },
            { status: 400 },
          );
        }

        // Validate files
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
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
                error: `Invalid file type: ${file.name || "unknown"}. Only JPEG, PNG, GIF, and WEBP are allowed`,
              },
              { status: 400 },
            );
          }

          if (file.size > maxFileSize) {
            return NextResponse.json(
              {
                success: false,
                error: `File ${file.name || "unknown"} is too large. Max 5MB per file`,
              },
              { status: 400 },
            );
          }
        }
      } catch (formDataError: any) {
        console.error("Error parsing form data:", formDataError);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to parse form data: " + formDataError.message,
          },
          { status: 400 },
        );
      }
    }
    // Handle application/json (base64 strings)
    else if (contentType.includes("application/json")) {
      try {
        const body = await request.json();
        base64Images = body.gallery || body.images || body.files || [];

        if (!base64Images || base64Images.length === 0) {
          return NextResponse.json(
            { success: false, error: "No image data provided" },
            { status: 400 },
          );
        }

        const maxFiles = 20;
        if (base64Images.length > maxFiles) {
          return NextResponse.json(
            { success: false, error: `Maximum ${maxFiles} files allowed` },
            { status: 400 },
          );
        }
      } catch (jsonError: any) {
        console.error("Error parsing JSON:", jsonError);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to parse JSON body: " + jsonError.message,
          },
          { status: 400 },
        );
      }
    }
    // Auto-detect format when Content-Type is missing or unrecognized
    else {
      console.log(
        "Unrecognized or missing content type, attempting to detect format...",
      );

      // Try to parse as form-data first (most common for file uploads)
      try {
        const formData = await request.formData();
        const uploadedFiles = formData.getAll("gallery") as File[];
        const detectedFiles = uploadedFiles.filter(
          (file) => file && file.size > 0,
        );

        if (detectedFiles.length > 0) {
          console.log(
            `✅ Detected form-data upload with ${detectedFiles.length} files`,
          );
          files = detectedFiles;

          // Validate files
          const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
          ];
          const maxFiles = 20;
          const maxFileSize = 5 * 1024 * 1024;

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
                  error: `Invalid file type: ${file.name || "unknown"}. Only JPEG, PNG, GIF, and WEBP are allowed`,
                },
                { status: 400 },
              );
            }

            if (file.size > maxFileSize) {
              return NextResponse.json(
                {
                  success: false,
                  error: `File ${file.name || "unknown"} is too large. Max 5MB per file`,
                },
                { status: 400 },
              );
            }
          }
        } else {
          // Try to parse as JSON
          const clonedRequest = request.clone();
          const text = await clonedRequest.text();

          if (text && text.trim()) {
            try {
              const body = JSON.parse(text);
              base64Images = body.gallery || body.images || body.files || [];

              if (base64Images.length > 0) {
                console.log(
                  `✅ Detected JSON/base64 upload with ${base64Images.length} images`,
                );

                const maxFiles = 20;
                if (base64Images.length > maxFiles) {
                  return NextResponse.json(
                    {
                      success: false,
                      error: `Maximum ${maxFiles} files allowed`,
                    },
                    { status: 400 },
                  );
                }
              } else {
                throw new Error("No images found in JSON");
              }
            } catch (jsonError) {
              throw new Error("Could not parse as JSON or form-data");
            }
          } else {
            throw new Error("Empty request body");
          }
        }
      } catch (detectionError: any) {
        return NextResponse.json(
          {
            success: false,
            error: "Unable to process request",
            message: "Please ensure you're using either:",
            details: {
              fileUpload: "Use multipart/form-data with field name 'gallery'",
              base64Upload:
                "Use application/json with { 'gallery': ['base64string'] }",
              receivedContentType: contentType || "none",
              error: detectionError.message,
            },
          },
          { status: 400 },
        );
      }
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

    const agency = agencyDoc.data();

    // FIX: Ensure gallery is always an array
    const currentGallery = Array.isArray(agency.gallery) ? agency.gallery : [];
    const maxImages = agency.plan?.maxGalleryImages || 20;

    console.log("Current gallery:", currentGallery);
    console.log("Gallery type:", typeof agency.gallery);
    console.log("Is array:", Array.isArray(agency.gallery));

    // Check if adding these images would exceed the limit
    const totalFiles = files.length || base64Images.length;
    if (currentGallery.length + totalFiles > maxImages) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot upload more than ${maxImages} images. Current: ${currentGallery.length}, Attempting to add: ${totalFiles}`,
        },
        { status: 400 },
      );
    }

    const uploadedUrls: string[] = [];
    const errors: string[] = [];

    // Process file uploads
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const extension = file.name.split(".").pop() || "jpg";
          const fileName = `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${extension}`;
          const storagePath = `agencies/${id}/gallery/${fileName}`;
          const storageRef = ref(storage, storagePath);

          const buffer = Buffer.from(await file.arrayBuffer());
          await uploadBytes(storageRef, buffer, { contentType: file.type });
          const downloadUrl = await getDownloadURL(storageRef);
          uploadedUrls.push(downloadUrl);
          console.log(`✅ Uploaded gallery image ${i + 1}/${files.length}`);
        } catch (error: any) {
          errors.push(`Failed to upload ${file.name}: ${error.message}`);
          console.error(`❌ Failed to upload ${file.name}:`, error.message);
        }
      }
    }

    // Process base64 uploads
    if (base64Images.length > 0) {
      for (let i = 0; i < base64Images.length; i++) {
        const base64Data = base64Images[i];
        try {
          const matches = base64Data.match(/^data:image\/(\w+);base64,/);
          const extension = matches ? matches[1] : "jpg";
          const fileName = `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${extension}`;
          const storagePath = `agencies/${id}/gallery/${fileName}`;
          const storageRef = ref(storage, storagePath);

          // Remove data URL prefix if present
          const base64String = base64Data.replace(
            /^data:image\/\w+;base64,/,
            "",
          );
          const buffer = Buffer.from(base64String, "base64");
          const mimeType = `image/${extension === "jpg" ? "jpeg" : extension}`;

          await uploadBytes(storageRef, buffer, { contentType: mimeType });
          const downloadUrl = await getDownloadURL(storageRef);
          uploadedUrls.push(downloadUrl);
          console.log(
            `✅ Uploaded gallery image ${i + 1}/${base64Images.length} (base64)`,
          );
        } catch (error: any) {
          errors.push(`Failed to upload image ${i + 1}: ${error.message}`);
          console.error(
            `❌ Failed to upload base64 image ${i + 1}:`,
            error.message,
          );
        }
      }
    }

    // Update agency document with new gallery URLs
    if (uploadedUrls.length > 0) {
      // FIX: Ensure we're using an array for the spread operator
      const existingGallery = Array.isArray(agency.gallery)
        ? agency.gallery
        : [];

      await updateDoc(agencyRef, {
        gallery: [...existingGallery, ...uploadedUrls],
        updatedAt: new Date(),
      });

      console.log(
        `✅ Updated agency ${id} gallery: ${existingGallery.length} -> ${existingGallery.length + uploadedUrls.length} images`,
      );
    }

    return NextResponse.json({
      success: errors.length === 0,
      data: {
        uploaded: uploadedUrls,
        failed: errors,
        totalUploaded: uploadedUrls.length,
        totalFailed: errors.length,
      },
      message: `${uploadedUrls.length} images uploaded successfully${errors.length > 0 ? `, ${errors.length} failed` : ""}`,
    });
  } catch (error: any) {
    console.error("Error uploading gallery images:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// Optional: Add DELETE endpoint for removing gallery images
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const { imageUrls } = await request.json();

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json(
        { success: false, error: "No image URLs provided" },
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

    // Filter out the images to delete
    const newGallery = currentGallery.filter((url) => !imageUrls.includes(url));

    // Delete files from storage
    const deletionErrors: string[] = [];
    for (const imageUrl of imageUrls) {
      try {
        // Extract storage path from URL
        const decodedUrl = decodeURIComponent(imageUrl);
        const pathMatch = decodedUrl.match(/\/o\/(.+?)\?/);

        if (pathMatch && pathMatch[1]) {
          const storagePath = decodeURIComponent(pathMatch[1]);
          const storageRef = ref(storage, storagePath);
          await deleteObject(storageRef);
          console.log(`✅ Deleted image from storage: ${storagePath}`);
        }
      } catch (error: any) {
        deletionErrors.push(`Failed to delete ${imageUrl}: ${error.message}`);
        console.error(`❌ Failed to delete image:`, error.message);
      }
    }

    // Update Firestore
    await updateDoc(agencyRef, {
      gallery: newGallery,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: {
        deleted: imageUrls.length - deletionErrors.length,
        failed: deletionErrors,
        remainingImages: newGallery.length,
      },
      message: `Deleted ${imageUrls.length - deletionErrors.length} images successfully`,
    });
  } catch (error: any) {
    console.error("Error deleting gallery images:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
