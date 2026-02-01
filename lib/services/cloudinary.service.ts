// lib/services/cloudinary.service.ts
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import { createHash } from "crypto";

// Configure Cloudinary
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.warn(
    "Cloudinary environment variables are not set. Image uploads will fail.",
  );
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  format?: string;
  width?: number;
  height?: number;
  error?: string;
  originalUrl?: string;
}

export interface EscortImageMigration {
  escortId: string;
  escortName: string;
  totalImages: number;
  successfulUploads: number;
  failedUploads: number;
  newImageUrls: string[];
  originalImageUrls: string[];
  previewPhotoUpdated: boolean;
  error?: string;
}

export interface MigrationStats {
  totalEscorts: number;
  totalImages: number;
  successfulUploads: number;
  failedUploads: number;
  migratedEscorts: number;
  failedEscorts: string[];
  timeTaken: number;
  dryRun?: boolean;
}

export class CloudinaryMigrationService {
  private readonly FOLDER_NAME =
    process.env.CLOUDINARY_ESCORT_FOLDER || "escorts";
  private BATCH_SIZE = 3;
  private readonly IMAGE_DELAY = 1000;
  private readonly ESCORT_DELAY = 2000;
  private readonly MAX_RETRIES = 2;

  constructor() {
    // Validate Cloudinary config
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.warn("Cloudinary is not configured. Image uploads will fail.");
    }
  }

  setBatchSize(size: number) {
    this.BATCH_SIZE = Math.max(1, Math.min(size, 10)); // Limit between 1 and 10
  }

  /**
   * Check if Cloudinary is configured
   */
  isConfigured(): boolean {
    return !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );
  }

  /**
   * Generate a unique filename for Cloudinary
   */
  private generateCloudinaryId(
    escortId: string,
    imageUrl: string,
    index: number,
  ): string {
    const urlHash = createHash("md5")
      .update(imageUrl)
      .digest("hex")
      .substring(0, 8);
    const timestamp = Date.now().toString().slice(-6);
    return `${this.FOLDER_NAME}/escort-${escortId}-${index}-${urlHash}-${timestamp}`;
  }

  /**
   * Download image buffer from URL
   */
  private async downloadImageBuffer(imageUrl: string): Promise<Buffer | null> {
    try {
      // Skip if image is already from Cloudinary
      if (
        imageUrl.includes("cloudinary.com") ||
        imageUrl.includes("res.cloudinary.com")
      ) {
        console.log(`⏭️ Skipping Cloudinary URL: ${imageUrl}`);
        return null;
      }

      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
        timeout: 15000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
        },
        maxRedirects: 3,
      });

      if (response.status === 200 && response.data) {
        return Buffer.from(response.data);
      }
      return null;
    } catch (error: any) {
      console.error(`Failed to download image ${imageUrl}:`, error.message);
      return null;
    }
  }

  /**
   * Upload image buffer to Cloudinary
   */
  private async uploadBufferToCloudinary(
    buffer: Buffer,
    publicId: string,
    originalUrl: string,
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          folder: this.FOLDER_NAME,
          overwrite: false,
          resource_type: "image",
          transformation: [
            { quality: "auto:good" },
            { fetch_format: "auto" },
            { width: 1200, height: 800, crop: "limit" },
          ],
          tags: ["escort", "migrated"],
          context: `source=${encodeURIComponent(originalUrl)}`,
        },
        (error, result) => {
          if (error) {
            resolve({
              success: false,
              error: error.message,
              originalUrl,
            });
          } else if (result) {
            resolve({
              success: true,
              url: result.secure_url,
              publicId: result.public_id,
              format: result.format,
              width: result.width,
              height: result.height,
              originalUrl,
            });
          } else {
            resolve({
              success: false,
              error: "Unknown upload error",
              originalUrl,
            });
          }
        },
      );

      uploadStream.end(buffer);
    });
  }

  /**
   * Upload a single image to Cloudinary
   */
  public async uploadImage(
    imageUrl: string,
    escortId: string,
    imageIndex: number,
  ): Promise<CloudinaryUploadResult> {
    // Skip if already a Cloudinary URL
    if (
      imageUrl.includes("cloudinary.com") ||
      imageUrl.includes("res.cloudinary.com")
    ) {
      return {
        success: true,
        url: imageUrl,
        originalUrl: imageUrl,
      };
    }

    let retries = 0;

    while (retries < this.MAX_RETRIES) {
      try {
        const publicId = this.generateCloudinaryId(
          escortId,
          imageUrl,
          imageIndex,
        );

        // Check if image already exists
        try {
          const existing = await cloudinary.api.resource(publicId);
          if (existing) {
            console.log(`⏭️ Image exists: ${publicId}`);
            return {
              success: true,
              url: existing.secure_url,
              publicId: existing.public_id,
              format: existing.format,
              width: existing.width,
              height: existing.height,
              originalUrl: imageUrl,
            };
          }
        } catch {
          // Doesn't exist, proceed
        }

        const buffer = await this.downloadImageBuffer(imageUrl);
        if (!buffer) {
          throw new Error("Failed to download image");
        }

        const result = await this.uploadBufferToCloudinary(
          buffer,
          publicId,
          imageUrl,
        );

        if (result.success) {
          console.log(`✅ Uploaded: ${result.url?.substring(0, 60)}...`);
        }

        return result;
      } catch (error: any) {
        retries++;
        console.error(
          `Attempt ${retries}/${this.MAX_RETRIES} failed:`,
          error.message,
        );

        if (retries >= this.MAX_RETRIES) {
          return {
            success: false,
            error: `Failed after ${this.MAX_RETRIES} attempts: ${error.message}`,
            originalUrl: imageUrl,
          };
        }

        await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
      }
    }

    return {
      success: false,
      error: "Max retries exceeded",
      originalUrl: imageUrl,
    };
  }

  /**
   * Migrate all images for a single escort
   */
  public async migrateEscortImages(
    escort: any,
    updateDatabase: boolean = true,
  ): Promise<EscortImageMigration> {
    const startTime = Date.now();
    const result: EscortImageMigration = {
      escortId: escort._id.toString(),
      escortName: escort.name || "Unknown Escort",
      totalImages: 0,
      successfulUploads: 0,
      failedUploads: 0,
      newImageUrls: [],
      originalImageUrls: [],
      previewPhotoUpdated: false,
    };

    try {
      const images = escort.images || [];
      result.totalImages = images.length;
      result.originalImageUrls = [...images];

      if (images.length === 0) {
        return result;
      }

      console.log(`📸 Processing ${escort.name}: ${images.length} images`);

      const uploadPromises: Promise<CloudinaryUploadResult>[] = [];
      const successfulUrls: string[] = [];

      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];

        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, this.IMAGE_DELAY));
        }

        const uploadPromise = this.uploadImage(imageUrl, result.escortId, i);
        uploadPromises.push(uploadPromise);

        if (uploadPromises.length >= 2 || i === images.length - 1) {
          const batchResults = await Promise.all(uploadPromises);

          batchResults.forEach((uploadResult) => {
            if (uploadResult.success && uploadResult.url) {
              successfulUrls.push(uploadResult.url);
              result.successfulUploads++;
            } else {
              result.failedUploads++;
            }
          });

          uploadPromises.length = 0;
        }
      }

      result.newImageUrls = successfulUrls;

      if (updateDatabase && successfulUrls.length > 0) {
        await this.updateEscortInDatabase(escort._id, successfulUrls);
        result.previewPhotoUpdated = true;
      }

      const timeTaken = Date.now() - startTime;
      console.log(
        `✅ ${escort.name}: ${result.successfulUploads}/${result.totalImages} in ${timeTaken}ms`,
      );
    } catch (error: any) {
      result.error = error.message;
      console.error(`❌ ${escort.name}:`, error);
    }

    return result;
  }

  /**
   * Update escort in database
   */
  private async updateEscortInDatabase(
    escortId: string,
    cloudinaryUrls: string[],
  ): Promise<void> {
    try {
      const Escort = (await import("@/models/Escort")).default;

      await Escort.findByIdAndUpdate(escortId, {
        $set: {
          images: cloudinaryUrls,
          previewPhoto: cloudinaryUrls[0] || "",
          imageSource: "cloudinary",
          imageMigrationDate: new Date(),
        },
      });
    } catch (error: any) {
      console.error(`DB update failed for ${escortId}:`, error.message);
      throw error;
    }
  }

  /**
   * Migrate images for all escorts
   */
  public async migrateAllEscorts(
    limit?: number,
    skip?: number,
    updateDatabase: boolean = true,
  ): Promise<MigrationStats> {
    const startTime = Date.now();
    const stats: MigrationStats = {
      totalEscorts: 0,
      totalImages: 0,
      successfulUploads: 0,
      failedUploads: 0,
      migratedEscorts: 0,
      failedEscorts: [],
      timeTaken: 0,
      dryRun: !updateDatabase,
    };

    try {
      // Import dynamically to avoid serverless function size issues
      const { connectToDB } = await import("@/lib/mongoose");
      await connectToDB();
      const Escort = (await import("@/models/Escort")).default;

      stats.totalEscorts = await Escort.countDocuments();

      const query = Escort.find({})
        .select("_id name images previewPhoto slug")
        .lean();

      if (skip) query.skip(skip);
      if (limit) query.limit(limit);

      const escorts = await query.exec();

      console.log(`🚀 Starting migration for ${escorts.length} escorts`);

      for (let i = 0; i < escorts.length; i += this.BATCH_SIZE) {
        const batch = escorts.slice(i, i + this.BATCH_SIZE);
        const batchNumber = Math.floor(i / this.BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(escorts.length / this.BATCH_SIZE);

        console.log(`📦 Batch ${batchNumber}/${totalBatches}`);

        const batchPromises = batch.map(async (escort, batchIndex) => {
          if (batchIndex > 0) {
            await new Promise((resolve) =>
              setTimeout(resolve, this.ESCORT_DELAY),
            );
          }

          const result = await this.migrateEscortImages(escort, updateDatabase);

          stats.totalImages += result.totalImages;
          stats.successfulUploads += result.successfulUploads;
          stats.failedUploads += result.failedUploads;

          if (result.successfulUploads > 0) {
            stats.migratedEscorts++;
          }

          if (result.error) {
            stats.failedEscorts.push(result.escortName);
          }

          return result;
        });

        await Promise.all(batchPromises);

        const progress = (((i + batch.length) / escorts.length) * 100).toFixed(
          1,
        );
        console.log(`📊 ${progress}% complete`);

        if (i + this.BATCH_SIZE < escorts.length) {
          await new Promise((resolve) =>
            setTimeout(resolve, this.ESCORT_DELAY),
          );
        }
      }

      stats.timeTaken = Date.now() - startTime;

      console.log("\n🎉 Migration Complete!");
      console.log("=".repeat(40));
      console.log(`Escorts: ${stats.migratedEscorts}/${escorts.length}`);
      console.log(`Images: ${stats.successfulUploads}/${stats.totalImages}`);
      console.log(`Time: ${(stats.timeTaken / 1000).toFixed(1)}s`);
      console.log(
        `Success: ${((stats.successfulUploads / stats.totalImages) * 100).toFixed(1)}%`,
      );
    } catch (error: any) {
      console.error("\n❌ Migration failed:", error);
      stats.timeTaken = Date.now() - startTime;
      throw error;
    }

    return stats;
  }
}

// Export singleton
export const cloudinaryMigrationService = new CloudinaryMigrationService();
