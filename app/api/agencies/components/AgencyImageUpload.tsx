// components/AgencyImageUpload.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

interface AgencyImageUploadProps {
  agencyId: string;
  // onUploadComplete?: (url: string) => void;
  onUploadComplete?: any;
  onDeleteComplete?: () => void;
}

export function AgencyLogoUpload({
  agencyId,
  onUploadComplete,
  onDeleteComplete,
}: AgencyImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Upload
    setUploading(true);
    const formData = new FormData();
    formData.append("logo", file);

    try {
      const response = await fetch(`/api/agencies/${agencyId}/upload-logo`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        onUploadComplete?.(data.data.url);
        alert("Logo uploaded successfully!");
      } else {
        alert(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
      URL.revokeObjectURL(previewUrl);
      setPreview(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete the logo?")) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/agencies/${agencyId}/upload-logo`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        onDeleteComplete?.();
        alert("Logo deleted successfully!");
      } else {
        alert(`Delete failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {uploading ? "Uploading..." : "Upload Logo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
        >
          {deleting ? "Deleting..." : "Delete Logo"}
        </button>
      </div>

      {preview && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <div className="relative w-32 h-32">
            <Image
              src={preview}
              alt="Logo preview"
              fill
              className="object-cover rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function AgencyGalleryUpload({
  agencyId,
  onUploadComplete,
}: AgencyImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Create previews
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);

    // Upload
    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("gallery", file);
    });

    try {
      const response = await fetch(`/api/agencies/${agencyId}/upload-gallery`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        onUploadComplete?.(data.data.uploaded);
        alert(`${data.data.uploaded} images uploaded successfully!`);
      } else {
        alert(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviews([]);
    }
  };

  return (
    <div className="space-y-4">
      <label className="inline-block cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        {uploading ? "Uploading..." : "Upload Gallery Images"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFilesChange}
          disabled={uploading}
          multiple
          className="hidden"
        />
      </label>

      {previews.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            Preview ({previews.length} images):
          </p>
          <div className="grid grid-cols-4 gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative w-24 h-24">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
