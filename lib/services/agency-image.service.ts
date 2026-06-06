// lib/services/agency-image.service.ts
import {storage} from "@/lib/firebase";
import {deleteObject, getDownloadURL, listAll, ref, uploadBytes,} from "firebase/storage";
import AgencyService from "./agency.service";

export interface AgencyImageUploadResult {
    success: boolean;
    url?: string;
    error?: string;
}

export class AgencyImageService {
    // Upload logo
    static async uploadLogo(
        agencyId: string,
        file: any,
        fileName?: string,
    ): Promise<AgencyImageUploadResult> {
        try {
            const extension = this.getFileExtension(file);
            const uniqueFileName = fileName || `logo_${Date.now()}.${extension}`;
            const storagePath = `agencies/${agencyId}/logo/${uniqueFileName}`;
            const storageRef = ref(storage, storagePath);

            const buffer =
                file instanceof Buffer ? file : Buffer.from(await file.arrayBuffer());

            await uploadBytes(storageRef, buffer, {
                contentType: this.getContentType(extension),
            });

            const downloadUrl = await getDownloadURL(storageRef);

            // Update agency document with logo URL
            await AgencyService.updateAgency(agencyId, {logo: downloadUrl});

            return {
                success: true,
                url: downloadUrl,
            };
        } catch (error: any) {
            console.error("Error uploading logo:", error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // Upload cover image
    static async uploadCoverImage(
        agencyId: string,
        file: any,
        fileName?: string,
    ): Promise<AgencyImageUploadResult> {
        try {
            const extension = this.getFileExtension(file);
            const uniqueFileName = fileName || `cover_${Date.now()}.${extension}`;
            const storagePath = `agencies/${agencyId}/cover/${uniqueFileName}`;
            const storageRef = ref(storage, storagePath);

            const buffer =
                file instanceof Buffer ? file : Buffer.from(await file.arrayBuffer());

            await uploadBytes(storageRef, buffer, {
                contentType: this.getContentType(extension),
            });

            const downloadUrl = await getDownloadURL(storageRef);

            // Update agency document with cover image URL
            await AgencyService.updateAgency(agencyId, {coverImage: downloadUrl});

            return {
                success: true,
                url: downloadUrl,
            };
        } catch (error: any) {
            console.error("Error uploading cover image:", error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // Upload gallery images
    static async uploadGalleryImages(
        agencyId: string,
        files: any[],
    ): Promise<AgencyImageUploadResult[]> {
        const results: AgencyImageUploadResult[] = [];
        const uploadedUrls: string[] = [];

        for (const file of files) {
            try {
                const extension = this.getFileExtension(file);
                const uniqueFileName = `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${extension}`;
                const storagePath = `agencies/${agencyId}/gallery/${uniqueFileName}`;
                const storageRef = ref(storage, storagePath);

                const buffer = Buffer.from(await file.arrayBuffer());

                await uploadBytes(storageRef, buffer, {
                    contentType: this.getContentType(extension),
                });

                const downloadUrl = await getDownloadURL(storageRef);
                uploadedUrls.push(downloadUrl);

                results.push({
                    success: true,
                    url: downloadUrl,
                });
            } catch (error: any) {
                results.push({
                    success: false,
                    error: error.message,
                });
            }
        }

        // Update agency document with new gallery URLs
        if (uploadedUrls.length > 0) {
            const agency = await AgencyService.getAgencyById(agencyId);
            if (agency) {
                const currentGallery = agency.gallery || [];
                await AgencyService.updateAgency(agencyId, {
                    gallery: [...currentGallery, ...uploadedUrls],
                });
            }
        }

        return results;
    }

    // Delete logo
    static async deleteLogo(agencyId: string): Promise<boolean> {
        try {
            const agency = await AgencyService.getAgencyById(agencyId);
            if (!agency?.logo) return true;

            // Extract path from URL
            const logoPath = this.extractPathFromUrl(agency.logo);
            if (logoPath) {
                const storageRef = ref(storage, logoPath);
                await deleteObject(storageRef);
            }

            // Update agency document
            await AgencyService.updateAgency(agencyId, {logo: ""});

            return true;
        } catch (error) {
            console.error("Error deleting logo:", error);
            return false;
        }
    }

    // Delete cover image
    static async deleteCoverImage(agencyId: string): Promise<boolean> {
        try {
            const agency = await AgencyService.getAgencyById(agencyId);
            if (!agency?.coverImage) return true;

            // Extract path from URL
            const coverPath = this.extractPathFromUrl(agency.coverImage);
            if (coverPath) {
                const storageRef = ref(storage, coverPath);
                await deleteObject(storageRef);
            }

            // Update agency document
            await AgencyService.updateAgency(agencyId, {coverImage: ""});

            return true;
        } catch (error) {
            console.error("Error deleting cover image:", error);
            return false;
        }
    }

    // Delete gallery image
    static async deleteGalleryImage(
        agencyId: string,
        imageUrl: string,
    ): Promise<boolean> {
        try {
            // Extract path from URL
            const imagePath = this.extractPathFromUrl(imageUrl);
            if (imagePath) {
                const storageRef = ref(storage, imagePath);
                await deleteObject(storageRef);
            }

            // Update agency document
            const agency = await AgencyService.getAgencyById(agencyId);
            if (agency) {
                const updatedGallery = agency.gallery.filter((url) => url !== imageUrl);
                await AgencyService.updateAgency(agencyId, {gallery: updatedGallery});
            }

            return true;
        } catch (error) {
            console.error("Error deleting gallery image:", error);
            return false;
        }
    }

    // Delete all agency images
    static async deleteAllAgencyImages(agencyId: string): Promise<boolean> {
        try {
            const storagePath = `agencies/${agencyId}`;
            const storageRef = ref(storage, storagePath);

            try {
                const listResult = await listAll(storageRef);
                const deletePromises = listResult.items.map((item) =>
                    deleteObject(item),
                );
                await Promise.all(deletePromises);
            } catch (error) {
                // Folder might not exist, that's fine
                console.log("No images found to delete");
            }

            // Update agency document
            await AgencyService.updateAgency(agencyId, {
                logo: "",
                coverImage: "",
                gallery: [],
            });

            return true;
        } catch (error) {
            console.error("Error deleting agency images:", error);
            return false;
        }
    }

    // Helper: Get file extension
    private static getFileExtension(file: any): string {
        if (typeof file?.name === "string") {
            return file.name.split(".").pop() || "jpg";
        }
        return "jpg";
    }

    // Helper: Get content type
    private static getContentType(extension: string): string {
        const types: Record<string, string> = {
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            gif: "image/gif",
            webp: "image/webp",
        };
        return types[extension.toLowerCase()] || "image/jpeg";
    }

    // Helper: Extract storage path from download URL
    private static extractPathFromUrl(url: string): string | null {
        try {
            // URL format: https://firebasestorage.googleapis.com/v0/b/bucket/o/agencies%2FagencyId%2Flogo%2Fimage.jpg
            const match = url.match(/\/o\/(.+?)\?/);
            if (match) {
                return decodeURIComponent(match[1]);
            }
            return null;
        } catch (error) {
            console.error("Error extracting path from URL:", error);
            return null;
        }
    }
}

export default AgencyImageService;
