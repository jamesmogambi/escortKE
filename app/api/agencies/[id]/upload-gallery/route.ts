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

    // Log the content type for debugging
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
    } else {
      // If content type is not recognized, try to parse as form data anyway (fallback)
      console.log(
        "Unrecognized content type, attempting to parse as form data...",
      );
      try {
        const formData = await request.formData();
        const uploadedFiles = formData.getAll("gallery") as File[];
        files = uploadedFiles.filter((file) => file && file.size > 0);

        if (files.length > 0) {
          console.log(
            `Successfully parsed ${files.length} files as form data despite content type: ${contentType}`,
          );

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
                  error: `Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed`,
                },
                { status: 400 },
              );
            }

            if (file.size > maxFileSize) {
              return NextResponse.json(
                {
                  success: false,
                  error: `File too large. Max 5MB per file`,
                },
                { status: 400 },
              );
            }
          }
        } else {
          return NextResponse.json(
            {
              success: false,
              error:
                "Content-Type must be 'multipart/form-data' or 'application/json'",
              receivedContentType: contentType,
            },
            { status: 400 },
          );
        }
      } catch (fallbackError) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Content-Type must be 'multipart/form-data' or 'application/json'",
            receivedContentType: contentType,
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
    const currentGallery = agency.gallery || [];
    const maxImages = agency.plan?.maxGalleryImages || 20;

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
      await updateDoc(agencyRef, {
        gallery: [...currentGallery, ...uploadedUrls],
        updatedAt: new Date(),
      });
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
