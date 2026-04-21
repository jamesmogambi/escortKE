// components/AgencyForm.tsx
"use client";

import { AgencyLogoUpload, AgencyGalleryUpload } from "./AgencyImageUpload";

export function AgencyForm({ agencyId }: { agencyId: string }) {
  const handleLogoUpload = (url: string) => {
    console.log("Logo uploaded:", url);
    // Update form state or UI
  };

  const handleGalleryUpload = (urls: string[]) => {
    console.log("Gallery images uploaded:", urls);
    // Update form state or UI
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Agency Logo</h3>
        <AgencyLogoUpload
          agencyId={agencyId}
          onUploadComplete={handleLogoUpload}
          onDeleteComplete={() => console.log("Logo deleted")}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Gallery Images</h3>
        <AgencyGalleryUpload
          agencyId={agencyId}
          onUploadComplete={handleGalleryUpload}
        />
      </div>
    </div>
  );
}
