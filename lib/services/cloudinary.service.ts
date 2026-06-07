// // lib/services/cloudinary.service.ts
// import { v2 as cloudinary } from "cloudinary";
// import axios from "axios";
// import { createHash } from "crypto";
// import https from "https";
//
// // Configure Cloudinary
// if (
//   !process.env.CLOUDINARY_CLOUD_NAME ||
//   !process.env.CLOUDINARY_API_KEY ||
//   !process.env.CLOUDINARY_API_SECRET
// ) {
//   console.warn(
//     "Cloudinary environment variables are not set. Image uploads will fail.",
//   );
// } else {
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//     secure: true,
//   });
// }
//
// export interface CloudinaryUploadResult {
//   success: boolean;
//   url?: string;
//   publicId?: string;
//   format?: string;
//   width?: number;
//   height?: number;
//   error?: string;
//   originalUrl?: string;
// }
//
// export interface EscortImageMigration {
//   escortId: string;
//   escortName: string;
//   totalImages: number;
//   successfulUploads: number;
//   failedUploads: number;
//   newImageUrls: string[];
//   originalImageUrls: string[];
//   previewPhotoUpdated: boolean;
//   error?: string;
// }
//
// export interface MigrationStats {
//   totalEscorts: number;
//   totalImages: number;
//   successfulUploads: number;
//   failedUploads: number;
//   migratedEscorts: number;
//   failedEscorts: string[];
//   timeTaken: number;
//   dryRun?: boolean;
// }
//
// export class CloudinaryMigrationService {
//   private readonly FOLDER_NAME =
//     process.env.CLOUDINARY_ESCORT_FOLDER || "escorts";
//   private BATCH_SIZE = 2;
//   private readonly IMAGE_DELAY = 1500;
//   private readonly ESCORT_DELAY = 3000;
//   private readonly MAX_RETRIES = 3;
//   private readonly USER_AGENTS = [
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
//     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
//     "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
//   ];
//
//   constructor() {
//     if (!process.env.CLOUDINARY_CLOUD_NAME) {
//       console.warn("Cloudinary is not configured. Image uploads will fail.");
//     }
//   }
//
//   setBatchSize(size: number) {
//     this.BATCH_SIZE = Math.max(1, Math.min(size, 5));
//   }
//
//   /**
//    * Check if Cloudinary is configured
//    */
//   isConfigured(): boolean {
//     return !!(
//       process.env.CLOUDINARY_CLOUD_NAME &&
//       process.env.CLOUDINARY_API_KEY &&
//       process.env.CLOUDINARY_API_SECRET
//     );
//   }
//
//   /**
//    * Generate a unique filename for Cloudinary
//    */
//   private generateCloudinaryId(
//     escortId: string,
//     imageUrl: string,
//     index: number,
//   ): string {
//     const urlHash = createHash("md5")
//       .update(imageUrl)
//       .digest("hex")
//       .substring(0, 8);
//     const timestamp = Date.now().toString().slice(-6);
//     const cleanEscortId = escortId.replace(/[^a-zA-Z0-9]/g, "");
//     return `${this.FOLDER_NAME}/escort-${cleanEscortId}-${index}-${urlHash}-${timestamp}`;
//   }
//
//   /**
//    * Get a random user agent
//    */
//   private getUserAgent(): string {
//     return this.USER_AGENTS[
//       Math.floor(Math.random() * this.USER_AGENTS.length)
//     ];
//   }
//
//   /**
//    * Download image buffer from URL with better error handling for WebP
//    */
//   private async downloadImageBuffer(imageUrl: string): Promise<Buffer | null> {
//     // Skip if image is already from Cloudinary
//     if (
//       imageUrl.includes("cloudinary.com") ||
//       imageUrl.includes("res.cloudinary.com")
//     ) {
//       console.log(`⏭️ Skipping Cloudinary URL: ${imageUrl}`);
//       return null;
//     }
//
//     const downloadStrategies = [
//       // Strategy 1: Direct download with browser headers
//       async () => {
//         const httpsAgent = new https.Agent({
//           rejectUnauthorized: false,
//           keepAlive: true,
//         });
//
//         const response = await axios.get(imageUrl, {
//           responseType: "arraybuffer",
//           timeout: 30000,
//           headers: {
//             "User-Agent": this.getUserAgent(),
//             Accept: "image/webp,image/apng,image/*,*/*;q=0.9",
//             "Accept-Encoding": "gzip, deflate, br",
//             "Accept-Language": "en-US,en;q=0.9",
//             Connection: "keep-alive",
//             "Cache-Control": "no-cache",
//             Pragma: "no-cache",
//             Referer: "https://www.afrohot.com/",
//             "Sec-Fetch-Dest": "image",
//             "Sec-Fetch-Mode": "no-cors",
//             "Sec-Fetch-Site": "cross-site",
//           },
//           httpsAgent,
//           maxRedirects: 5,
//           validateStatus: (status) => status === 200,
//         });
//
//         if (response.status === 200 && response.data) {
//           return Buffer.from(response.data);
//         }
//         throw new Error(`HTTP ${response.status}`);
//       },
//
//       // Strategy 2: Try without referer
//       async () => {
//         const response = await axios.get(imageUrl, {
//           responseType: "arraybuffer",
//           timeout: 20000,
//           headers: {
//             "User-Agent": this.getUserAgent(),
//             Accept: "image/webp,image/*",
//           },
//         });
//         return Buffer.from(response.data);
//       },
//
//       // Strategy 3: Try as blob
//       async () => {
//         const response = await axios.get(imageUrl, {
//           responseType: "blob",
//           timeout: 20000,
//           headers: {
//             "User-Agent": this.getUserAgent(),
//           },
//         });
//         return Buffer.from(await response.data.arrayBuffer());
//       },
//     ];
//
//     for (let i = 0; i < downloadStrategies.length; i++) {
//       try {
//         console.log(
//           `  📥 Download strategy ${i + 1} for: ${imageUrl.substring(0, 60)}...`,
//         );
//         const buffer = await downloadStrategies[i]();
//         if (buffer && buffer.length > 0) {
//           console.log(
//             `  ✅ Downloaded: ${(buffer.length / 1024).toFixed(2)}KB`,
//           );
//           return buffer;
//         }
//       } catch (error: any) {
//         console.log(`  ⚠️ Strategy ${i + 1} failed: ${error.message}`);
//
//         // Try alternative formats if WebP fails
//         if (
//           imageUrl.includes(".webp") &&
//           imageUrl.includes("backblazeb2.com")
//         ) {
//           console.log(`  🔄 Trying alternative formats...`);
//
//           const alternativeUrls = [
//             imageUrl.replace(".webp", ".jpg"),
//             imageUrl.replace(".webp", ".jpeg"),
//             imageUrl.replace(".webp", ".png"),
//             imageUrl.replace(".webp", ""),
//             imageUrl.replace("webp", "jpg"),
//           ];
//
//           for (const altUrl of alternativeUrls) {
//             try {
//               const altResponse = await axios.get(altUrl, {
//                 responseType: "arraybuffer",
//                 timeout: 15000,
//                 headers: { "User-Agent": this.getUserAgent() },
//               });
//               if (altResponse.status === 200 && altResponse.data) {
//                 console.log(
//                   `  ✅ Downloaded alternative: ${altUrl.substring(0, 60)}...`,
//                 );
//                 return Buffer.from(altResponse.data);
//               }
//             } catch {
//               continue;
//             }
//           }
//         }
//       }
//     }
//
//     return null;
//   }
//
//   /**
//    * Upload image buffer to Cloudinary with WebP support
//    */
//   private async uploadBufferToCloudinary(
//     buffer: Buffer,
//     publicId: string,
//     originalUrl: string,
//   ): Promise<CloudinaryUploadResult> {
//     return new Promise((resolve) => {
//       const isWebP = originalUrl.toLowerCase().includes(".webp");
//
//       const uploadOptions: any = {
//         public_id: publicId,
//         folder: this.FOLDER_NAME,
//         overwrite: false,
//         resource_type: "image",
//         tags: ["escort", "migrated"],
//         context: `source=${encodeURIComponent(originalUrl)}`,
//         quality: "auto:good",
//         fetch_format: "auto",
//         width: 1200,
//         height: 800,
//         crop: "limit",
//       };
//
//       if (isWebP) {
//         uploadOptions.format = "webp";
//       }
//
//       const uploadStream = cloudinary.uploader.upload_stream(
//         uploadOptions,
//         (error, result) => {
//           if (error) {
//             console.error(`  ❌ Cloudinary upload error:`, error.message);
//             resolve({
//               success: false,
//               error: error.message,
//               originalUrl,
//             });
//           } else if (result) {
//             console.log(`  ✅ Cloudinary upload: ${result.public_id}`);
//             resolve({
//               success: true,
//               url: result.secure_url,
//               publicId: result.public_id,
//               format: result.format,
//               width: result.width,
//               height: result.height,
//               originalUrl,
//             });
//           } else {
//             resolve({
//               success: false,
//               error: "Unknown upload error",
//               originalUrl,
//             });
//           }
//         },
//       );
//
//       uploadStream.end(buffer);
//     });
//   }
//
//   /**
//    * Alternative upload method using URL
//    */
//   private async uploadUrlToCloudinary(
//     imageUrl: string,
//     publicId: string,
//   ): Promise<CloudinaryUploadResult> {
//     return new Promise((resolve) => {
//       cloudinary.uploader.upload(
//         imageUrl,
//         {
//           public_id: publicId,
//           folder: this.FOLDER_NAME,
//           overwrite: false,
//           resource_type: "image",
//           tags: ["escort", "migrated", "url-upload"],
//           quality: "auto:good",
//           fetch_format: "auto",
//           width: 1200,
//           height: 800,
//           crop: "limit",
//         },
//         (error, result) => {
//           if (error) {
//             resolve({
//               success: false,
//               error: error.message,
//               originalUrl: imageUrl,
//             });
//           } else if (result) {
//             resolve({
//               success: true,
//               url: result.secure_url,
//               publicId: result.public_id,
//               format: result.format,
//               width: result.width,
//               height: result.height,
//               originalUrl: imageUrl,
//             });
//           } else {
//             resolve({
//               success: false,
//               error: "Unknown upload error",
//               originalUrl: imageUrl,
//             });
//           }
//         },
//       );
//     });
//   }
//
//   /**
//    * Upload a single image to Cloudinary with multiple fallback strategies
//    */
//   public async uploadImage(
//     imageUrl: string,
//     escortId: string,
//     imageIndex: number,
//   ): Promise<CloudinaryUploadResult> {
//     // Skip if already a Cloudinary URL
//     if (
//       imageUrl.includes("cloudinary.com") ||
//       imageUrl.includes("res.cloudinary.com")
//     ) {
//       return {
//         success: true,
//         url: imageUrl,
//         originalUrl: imageUrl,
//       };
//     }
//
//     const publicId = this.generateCloudinaryId(escortId, imageUrl, imageIndex);
//
//     // Check if image already exists
//     try {
//       const existing = await cloudinary.api.resource(publicId);
//       if (existing) {
//         console.log(`  ⏭️ Image exists: ${publicId}`);
//         return {
//           success: true,
//           url: existing.secure_url,
//           publicId: existing.public_id,
//           format: existing.format,
//           width: existing.width,
//           height: existing.height,
//           originalUrl: imageUrl,
//         };
//       }
//     } catch {
//       // Doesn't exist, proceed
//     }
//
//     // Try different upload strategies
//     const uploadStrategies = [
//       // Strategy 1: Download buffer and upload
//       async () => {
//         const buffer = await this.downloadImageBuffer(imageUrl);
//         if (buffer && buffer.length > 0) {
//           return await this.uploadBufferToCloudinary(
//             buffer,
//             publicId,
//             imageUrl,
//           );
//         }
//         throw new Error("Failed to download image");
//       },
//
//       // Strategy 2: Direct URL upload
//       async () => {
//         return await this.uploadUrlToCloudinary(imageUrl, publicId);
//       },
//
//       // Strategy 3: Try with different format
//       async () => {
//         if (imageUrl.includes(".webp")) {
//           const jpegUrl = imageUrl.replace(".webp", ".jpg");
//           return await this.uploadUrlToCloudinary(jpegUrl, `${publicId}-jpg`);
//         }
//         throw new Error("Not a WebP image");
//       },
//     ];
//
//     for (let retry = 0; retry < this.MAX_RETRIES; retry++) {
//       for (let strategy = 0; strategy < uploadStrategies.length; strategy++) {
//         try {
//           console.log(
//             `  🔄 Attempt ${retry + 1}/${this.MAX_RETRIES}, Strategy ${strategy + 1}/${uploadStrategies.length}`,
//           );
//
//           const result = await uploadStrategies[strategy]();
//
//           if (result.success) {
//             console.log(`  ✅ Upload successful`);
//             return result;
//           }
//         } catch (error: any) {
//           console.log(`  ⚠️ Strategy ${strategy + 1} failed: ${error.message}`);
//
//           if (
//             retry === this.MAX_RETRIES - 1 &&
//             strategy === uploadStrategies.length - 1
//           ) {
//             return {
//               success: false,
//               error: `All strategies failed: ${error.message}`,
//               originalUrl: imageUrl,
//             };
//           }
//         }
//       }
//
//       if (retry < this.MAX_RETRIES - 1) {
//         const delay = 2000 * (retry + 1);
//         console.log(`  ⏳ Waiting ${delay}ms before retry...`);
//         await new Promise((resolve) => setTimeout(resolve, delay));
//       }
//     }
//
//     return {
//       success: false,
//       error: "Max retries exceeded",
//       originalUrl: imageUrl,
//     };
//   }
//
//   /**
//    * Migrate all images for a single escort
//    */
//   public async migrateEscortImages(
//     escort: any,
//     updateDatabase: boolean = true,
//   ): Promise<EscortImageMigration> {
//     const startTime = Date.now();
//     const result: EscortImageMigration = {
//       escortId: escort._id.toString(),
//       escortName: escort.name || "Unknown Escort",
//       totalImages: 0,
//       successfulUploads: 0,
//       failedUploads: 0,
//       newImageUrls: [],
//       originalImageUrls: [],
//       previewPhotoUpdated: false,
//     };
//
//     try {
//       const images = escort.images || [];
//       result.totalImages = images.length;
//       result.originalImageUrls = [...images];
//
//       if (images.length === 0) {
//         console.log(`📸 ${escort.name}: No images to migrate`);
//         return result;
//       }
//
//       console.log(`\n📸 Processing ${escort.name}: ${images.length} images`);
//
//       const successfulUrls: string[] = [];
//
//       for (let i = 0; i < images.length; i++) {
//         const imageUrl = images[i];
//
//         console.log(`  🖼️ Image ${i + 1}/${images.length}:`);
//         console.log(`     URL: ${imageUrl.substring(0, 80)}...`);
//
//         const uploadResult = await this.uploadImage(
//           imageUrl,
//           result.escortId,
//           i,
//         );
//
//         if (uploadResult.success && uploadResult.url) {
//           successfulUrls.push(uploadResult.url);
//           result.successfulUploads++;
//           console.log(
//             `  ✅ Success (${result.successfulUploads}/${result.totalImages})`,
//           );
//           console.log(`     New: ${uploadResult.url.substring(0, 80)}...`);
//         } else {
//           result.failedUploads++;
//           console.log(`  ❌ Failed: ${uploadResult.error || "Unknown error"}`);
//         }
//
//         if (i < images.length - 1) {
//           console.log(
//             `  ⏳ Waiting ${this.IMAGE_DELAY}ms before next image...`,
//           );
//           await new Promise((resolve) => setTimeout(resolve, this.IMAGE_DELAY));
//         }
//       }
//
//       result.newImageUrls = successfulUrls;
//
//       if (updateDatabase && successfulUrls.length > 0) {
//         await this.updateEscortInDatabase(
//           escort._id,
//           successfulUrls,
//           escort.previewPhoto,
//           escort.name,
//         );
//         result.previewPhotoUpdated = true;
//       }
//
//       const timeTaken = Date.now() - startTime;
//       console.log(
//         `\n✅ ${escort.name}: ${result.successfulUploads}/${result.totalImages} successful in ${(timeTaken / 1000).toFixed(1)}s`,
//       );
//     } catch (error: any) {
//       result.error = error.message;
//       console.error(`\n❌ ${escort.name}:`, error.message);
//     }
//
//     return result;
//   }
//
//   /**
//    * Update escort in database with Cloudinary URLs
//    */
//   private async updateEscortInDatabase(
//     escortId: string,
//     cloudinaryUrls: string[],
//     originalPreviewPhoto?: string,
//     escortName?: string,
//   ): Promise<void> {
//     try {
//       const Escort = (await import("@/models/Escort")).default;
//
//       let newPreviewPhoto = cloudinaryUrls[0] || "";
//
//       // Try to find matching preview photo
//       if (originalPreviewPhoto) {
//         const originalFilename =
//           originalPreviewPhoto.split("/").pop()?.split(".")[0] || "";
//
//         for (let i = 0; i < cloudinaryUrls.length; i++) {
//           const url = cloudinaryUrls[i];
//           if (
//             url.includes(originalFilename) ||
//             (escortName &&
//               url.includes(escortName.toLowerCase().replace(/\s+/g, "-")))
//           ) {
//             newPreviewPhoto = cloudinaryUrls[i];
//             break;
//           }
//         }
//       }
//
//       await Escort.findByIdAndUpdate(escortId, {
//         $set: {
//           images: cloudinaryUrls,
//           previewPhoto: newPreviewPhoto,
//           imageSource: "cloudinary",
//           imageMigrationDate: new Date(),
//         },
//       });
//
//       console.log(`  💾 Database updated for ${escortId}`);
//     } catch (error: any) {
//       console.error(`  ❌ DB update failed for ${escortId}:`, error.message);
//       throw error;
//     }
//   }
//
//   /**
//    * Migrate images for all escorts
//    */
//   public async migrateAllEscorts(
//     limit?: number,
//     skip?: number,
//     updateDatabase: boolean = true,
//   ): Promise<MigrationStats> {
//     const startTime = Date.now();
//     const stats: MigrationStats = {
//       totalEscorts: 0,
//       totalImages: 0,
//       successfulUploads: 0,
//       failedUploads: 0,
//       migratedEscorts: 0,
//       failedEscorts: [],
//       timeTaken: 0,
//       dryRun: !updateDatabase,
//     };
//
//     try {
//       const { connectToDB } = await import("@/lib/mongoose");
//       await connectToDB();
//       const Escort = (await import("@/models/Escort")).default;
//
//       // Build query
//       const query: any = {
//         images: { $exists: true, $ne: [] },
//       };
//
//       // Only get escorts that don't have Cloudinary images yet
//       if (updateDatabase) {
//         query.$or = [
//           { imageSource: { $ne: "cloudinary" } },
//           { imageSource: { $exists: false } },
//         ];
//       }
//
//       stats.totalEscorts = await Escort.countDocuments(query);
//
//       const findQuery = Escort.find(query)
//         .select("_id name images previewPhoto slug email telephone")
//         .lean();
//
//       if (skip) findQuery.skip(skip);
//       if (limit) findQuery.limit(limit);
//
//       const escorts = await findQuery.exec();
//
//       console.log("\n" + "=".repeat(60));
//       console.log(`🚀 Starting Cloudinary Image Migration`);
//       console.log("=".repeat(60));
//       console.log(`📊 Found ${escorts.length} escorts with images to migrate`);
//       if (stats.dryRun) console.log(`⚠️ DRY RUN MODE - No database updates`);
//       console.log("=".repeat(60) + "\n");
//
//       for (let i = 0; i < escorts.length; i += this.BATCH_SIZE) {
//         const batch = escorts.slice(i, i + this.BATCH_SIZE);
//         const batchNumber = Math.floor(i / this.BATCH_SIZE) + 1;
//         const totalBatches = Math.ceil(escorts.length / this.BATCH_SIZE);
//
//         console.log(`\n📦 Batch ${batchNumber}/${totalBatches}`);
//         console.log("-".repeat(40));
//
//         const batchPromises = batch.map(async (escort) => {
//           const result = await this.migrateEscortImages(escort, updateDatabase);
//
//           stats.totalImages += result.totalImages;
//           stats.successfulUploads += result.successfulUploads;
//           stats.failedUploads += result.failedUploads;
//
//           if (result.successfulUploads > 0) {
//             stats.migratedEscorts++;
//           }
//
//           if (result.error || result.failedUploads === result.totalImages) {
//             stats.failedEscorts.push(
//               `${escort.name} (${result.failedUploads}/${result.totalImages})`,
//             );
//           }
//
//           return result;
//         });
//
//         await Promise.all(batchPromises);
//
//         const progress = (((i + batch.length) / escorts.length) * 100).toFixed(
//           1,
//         );
//         console.log(
//           `\n📊 Progress: ${progress}% (${i + batch.length}/${escorts.length})`,
//         );
//
//         if (i + this.BATCH_SIZE < escorts.length) {
//           console.log(`⏳ Waiting ${this.ESCORT_DELAY}ms before next batch...`);
//           await new Promise((resolve) =>
//             setTimeout(resolve, this.ESCORT_DELAY),
//           );
//         }
//       }
//
//       stats.timeTaken = Date.now() - startTime;
//
//       // Summary
//       console.log("\n" + "=".repeat(60));
//       console.log("🎉 Migration Complete!");
//       console.log("=".repeat(60));
//       console.log(`📊 STATISTICS:`);
//       console.log(`   • Escorts Processed: ${escorts.length}`);
//       console.log(`   • Escorts Migrated: ${stats.migratedEscorts}`);
//       console.log(`   • Total Images: ${stats.totalImages}`);
//       console.log(`   • Successful Uploads: ${stats.successfulUploads}`);
//       console.log(`   • Failed Uploads: ${stats.failedUploads}`);
//       console.log(
//         `   • Success Rate: ${((stats.successfulUploads / stats.totalImages) * 100).toFixed(1)}%`,
//       );
//       console.log(`   • Time Taken: ${(stats.timeTaken / 1000).toFixed(1)}s`);
//
//       if (stats.failedEscorts.length > 0) {
//         console.log(`\n❌ Failed Escorts (${stats.failedEscorts.length}):`);
//         stats.failedEscorts.slice(0, 10).forEach((name, i) => {
//           console.log(`   ${i + 1}. ${name}`);
//         });
//         if (stats.failedEscorts.length > 10) {
//           console.log(`   ... and ${stats.failedEscorts.length - 10} more`);
//         }
//       }
//
//       console.log("=".repeat(60) + "\n");
//     } catch (error: any) {
//       console.error("\n❌ Migration failed:", error);
//       stats.timeTaken = Date.now() - startTime;
//       throw error;
//     }
//
//     return stats;
//   }
//
//   /**
//    * Migrate images for a specific escort by ID
//    */
//   public async migrateEscortById(
//     escortId: string,
//     updateDatabase: boolean = true,
//   ): Promise<EscortImageMigration | null> {
//     try {
//       const { connectToDB } = await import("@/lib/mongoose");
//       await connectToDB();
//       const Escort = (await import("@/models/Escort")).default;
//
//       const escort = (await Escort.findById(escortId)
//         .select("_id name images previewPhoto slug")
//         .lean()) as any;
//
//       if (!escort) {
//         console.log(`❌ Escort not found: ${escortId}`);
//         return null;
//       }
//
//       console.log(`\n🔍 Found escort: ${escort.name} (${escortId})`);
//       return await this.migrateEscortImages(escort, updateDatabase);
//     } catch (error: any) {
//       console.error(`❌ Failed to migrate escort ${escortId}:`, error.message);
//       throw error;
//     }
//   }
//
//   /**
//    * Retry failed images for all escorts
//    */
//   public async retryFailedImages(limit?: number): Promise<MigrationStats> {
//     try {
//       const { connectToDB } = await import("@/lib/mongoose");
//       await connectToDB();
//       const Escort = (await import("@/models/Escort")).default;
//
//       // Find escorts that have Cloudinary images but also still have some original URLs
//       const escorts = await Escort.find({
//         images: { $regex: "backblazeb2.com|amazonaws.com" },
//         imageSource: "cloudinary",
//       })
//         .select("_id name images previewPhoto slug")
//         .limit(limit || 50)
//         .lean();
//
//       console.log(
//         `\n🔄 Found ${escorts.length} escorts with failed images to retry`,
//       );
//
//       return await this.migrateAllEscorts(limit, 0, true);
//     } catch (error: any) {
//       console.error("❌ Failed to retry images:", error.message);
//       throw error;
//     }
//   }
//
//   /**
//    * Get migration statistics
//    */
//   public async getMigrationStats(): Promise<any> {
//     try {
//       const { connectToDB } = await import("@/lib/mongoose");
//       await connectToDB();
//       const Escort = (await import("@/models/Escort")).default;
//
//       const total = await Escort.countDocuments();
//       const withCloudinary = await Escort.countDocuments({
//         imageSource: "cloudinary",
//       });
//       const withImages = await Escort.countDocuments({
//         images: { $exists: true, $ne: [] },
//       });
//       const pending = await Escort.countDocuments({
//         $or: [
//           { imageSource: { $ne: "cloudinary" } },
//           { imageSource: { $exists: false } },
//         ],
//         images: { $exists: true, $ne: [] },
//       });
//
//       return {
//         totalEscorts: total,
//         escortsWithImages: withImages,
//         escortsWithCloudinary: withCloudinary,
//         pendingMigration: pending,
//         completionRate:
//           withImages > 0 ? ((withCloudinary / withImages) * 100).toFixed(1) : 0,
//       };
//     } catch (error: any) {
//       console.error("❌ Failed to get stats:", error.message);
//       throw error;
//     }
//   }
// }
//
// // Export singleton
// export const cloudinaryMigrationService = new CloudinaryMigrationService();
