// lib/migration-queue.ts
import { db, storage } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export interface MigrationJob {
  id: string;
  status: "pending" | "processing" | "completed" | "failed" | "paused";
  totalEscorts: number;
  processedEscorts: number;
  totalImages: number;
  uploadedImages: number;
  failedImages: number;
  startedAt: Date;
  completedAt?: Date;
  pausedAt?: Date;
  errors: string[];
  currentBatch: number;
  lastProcessedId?: string;
}

class MigrationQueue {
  private static instance: MigrationQueue;
  private isProcessing = false;
  private isPaused = false;
  private currentJob: MigrationJob | null = null;
  private batchSize = 5;
  private delayBetweenBatches = 2000;
  private delayBetweenImages = 500;

  static getInstance(): MigrationQueue {
    if (!MigrationQueue.instance) {
      MigrationQueue.instance = new MigrationQueue();
    }
    return MigrationQueue.instance;
  }

  async startMigration(options?: {
    batchSize?: number;
    delay?: number;
    imageDelay?: number;
    maxEscorts?: number;
  }) {
    if (this.isProcessing) {
      return {
        success: false,
        message: "Migration already in progress",
        job: this.currentJob,
      };
    }

    if (options?.batchSize) this.batchSize = options.batchSize;
    if (options?.delay) this.delayBetweenBatches = options.delay;
    if (options?.imageDelay) this.delayBetweenImages = options.imageDelay;

    this.isProcessing = true;
    this.isPaused = false;

    // Get all escorts that have images but haven't been migrated
    const escortsRef = collection(db, "escorts");
    const snapshot = await getDocs(escortsRef);

    // Filter escorts that have images and need migration
    let escorts = snapshot.docs.filter((doc) => {
      const data = doc.data();
      const hasImages = data.images && data.images.length > 0;
      const notMigrated = !data.imagesMigrated;
      const migrationNotAttempted = !data.migrationAttempted;

      // Log for debugging
      if (hasImages && notMigrated) {
        console.log(
          `Found escort needing migration: ${data.name} (${doc.id}) - ${data.images.length} images`,
        );
      }

      return hasImages && (notMigrated || migrationNotAttempted);
    });

    console.log(`Total escorts in collection: ${snapshot.size}`);
    console.log(`Escorts needing migration: ${escorts.length}`);

    if (options?.maxEscorts && options.maxEscorts > 0) {
      escorts = escorts.slice(0, options.maxEscorts);
    }

    if (escorts.length === 0) {
      this.isProcessing = false;
      return {
        success: false,
        message:
          "No escorts found that need migration. All escorts either have no images or have already been migrated.",
        job: null,
      };
    }

    this.currentJob = {
      id: Date.now().toString(),
      status: "processing",
      totalEscorts: escorts.length,
      processedEscorts: 0,
      totalImages: escorts.reduce(
        (sum, doc) => sum + (doc.data().images?.length || 0),
        0,
      ),
      uploadedImages: 0,
      failedImages: 0,
      startedAt: new Date(),
      errors: [],
      currentBatch: 0,
      lastProcessedId: undefined,
    };

    console.log(`📊 Migration Job Created: ${this.currentJob.id}`);
    console.log(`📊 Total escorts to process: ${this.currentJob.totalEscorts}`);
    console.log(`📸 Total images to upload: ${this.currentJob.totalImages}`);

    // Start processing in background
    this.processMigration(escorts).catch(console.error);

    return {
      success: true,
      message: "Migration started in background",
      job: this.currentJob,
    };
  }

  private async processMigration(escorts: any[]) {
    try {
      for (let i = 0; i < escorts.length; i += this.batchSize) {
        // Check if paused
        while (this.isPaused) {
          console.log("⏸️ Migration paused, waiting...");
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }

        const batch = escorts.slice(i, i + this.batchSize);
        this.currentJob!.currentBatch = Math.floor(i / this.batchSize) + 1;

        console.log(
          `\n📦 Processing batch ${this.currentJob!.currentBatch} (${i + 1}-${Math.min(i + this.batchSize, escorts.length)}/${escorts.length})`,
        );

        for (const escortDoc of batch) {
          await this.processEscort(escortDoc);
          this.currentJob!.processedEscorts++;
          this.currentJob!.lastProcessedId = escortDoc.id;

          // Save progress to Firestore for resume capability
          await this.saveProgress();
        }

        // Update job progress
        const progressPercent = (
          (this.currentJob!.processedEscorts / this.currentJob!.totalEscorts) *
          100
        ).toFixed(1);
        console.log(
          `\n📊 Progress: ${this.currentJob!.processedEscorts}/${this.currentJob!.totalEscorts} escorts (${progressPercent}%)`,
        );
        console.log(
          `📸 Images uploaded: ${this.currentJob!.uploadedImages}/${this.currentJob!.totalImages}`,
        );

        // Wait between batches
        if (i + this.batchSize < escorts.length) {
          console.log(
            `⏳ Waiting ${this.delayBetweenBatches}ms before next batch...`,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, this.delayBetweenBatches),
          );
        }
      }

      this.currentJob!.status = "completed";
      this.currentJob!.completedAt = new Date();

      console.log("\n" + "=".repeat(50));
      console.log("✅ MIGRATION COMPLETED!");
      console.log("=".repeat(50));
      console.log(
        `📊 Escorts processed: ${this.currentJob!.processedEscorts}/${this.currentJob!.totalEscorts}`,
      );
      console.log(
        `📸 Images uploaded: ${this.currentJob!.uploadedImages}/${this.currentJob!.totalImages}`,
      );
      console.log(`❌ Images failed: ${this.currentJob!.failedImages}`);
      console.log("=".repeat(50));
    } catch (error: any) {
      console.error("❌ Migration failed:", error);
      this.currentJob!.status = "failed";
      this.currentJob!.errors.push(error.message);
    } finally {
      this.isProcessing = false;
    }
  }

  private async processEscort(escortDoc: any) {
    const data = escortDoc.data();
    const escortId = escortDoc.id;
    const images = data.images || [];

    console.log(`\n📸 Processing: ${data.name}`);
    console.log(`   ID: ${escortId}`);
    console.log(`   Images: ${images.length}`);

    const newImageUrls: string[] = [];
    let uploaded = 0;
    let failed = 0;

    for (let j = 0; j < images.length; j++) {
      const imageUrl = images[j];

      if (!imageUrl || !imageUrl.startsWith("http")) {
        console.log(`   ⏭️ Skipping invalid URL: ${imageUrl}`);
        failed++;
        continue;
      }

      try {
        console.log(`   📥 Downloading image ${j + 1}/${images.length}...`);

        const response = await fetch(imageUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const contentType = response.headers.get("content-type") || "";
        let extension = "jpg";
        if (contentType.includes("png")) extension = "png";
        else if (contentType.includes("gif")) extension = "gif";
        else if (contentType.includes("webp")) extension = "webp";
        else if (contentType.includes("jpeg")) extension = "jpg";

        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const dataUrl = `data:${contentType};base64,${base64}`;

        const fileName = `${escortId}/${Date.now()}_${j}.${extension}`;
        const storageRef = ref(storage, `escort-images/${fileName}`);

        await uploadString(storageRef, dataUrl, "data_url");
        const downloadUrl = await getDownloadURL(storageRef);

        newImageUrls.push(downloadUrl);
        uploaded++;
        this.currentJob!.uploadedImages++;

        console.log(`   ✅ Uploaded image ${j + 1}/${images.length}`);
      } catch (error: any) {
        failed++;
        this.currentJob!.failedImages++;
        console.error(`   ❌ Failed to upload image ${j + 1}:`, error.message);
        this.currentJob!.errors.push(
          `Failed to upload image for ${data.name}: ${error.message}`,
        );
      }

      // Wait between images
      await new Promise((resolve) =>
        setTimeout(resolve, this.delayBetweenImages),
      );
    }

    if (newImageUrls.length > 0) {
      const escortRef = doc(db, "escorts", escortId);
      await updateDoc(escortRef, {
        images: newImageUrls,
        previewPhoto: newImageUrls[0] || data.previewPhoto,
        imagesMigrated: true,
        migratedAt: new Date().toISOString(),
        originalImageCount: images.length,
        uploadedImagesCount: uploaded,
        failedImagesCount: failed,
      });
      console.log(
        `   ✅ Updated ${data.name}: ${uploaded}/${images.length} images migrated`,
      );
    } else if (images.length > 0) {
      console.log(`   ⚠️ No images could be migrated for ${data.name}`);
      // Mark as attempted but failed - can retry later
      const escortRef = doc(db, "escorts", escortId);
      await updateDoc(escortRef, {
        migrationAttempted: true,
        migrationAttemptedAt: new Date().toISOString(),
        migrationFailed: true,
      });
    }
  }

  private async saveProgress() {
    try {
      const progressRef = doc(db, "migration_progress", "current");
      await updateDoc(progressRef, {
        jobId: this.currentJob!.id,
        lastProcessedId: this.currentJob!.lastProcessedId,
        processedEscorts: this.currentJob!.processedEscorts,
        uploadedImages: this.currentJob!.uploadedImages,
        failedImages: this.currentJob!.failedImages,
        updatedAt: new Date().toISOString(),
      }).catch(async () => {
        // If document doesn't exist, create it
        const { setDoc } = await import("firebase/firestore");
        await setDoc(progressRef, {
          jobId: this.currentJob!.id,
          lastProcessedId: this.currentJob!.lastProcessedId,
          processedEscorts: this.currentJob!.processedEscorts,
          uploadedImages: this.currentJob!.uploadedImages,
          failedImages: this.currentJob!.failedImages,
          updatedAt: new Date().toISOString(),
        });
      });
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  }

  async pauseMigration() {
    if (!this.isProcessing) {
      return { success: false, message: "No migration in progress" };
    }
    this.isPaused = true;
    this.currentJob!.status = "paused";
    this.currentJob!.pausedAt = new Date();
    return { success: true, message: "Migration paused", job: this.currentJob };
  }

  async resumeMigration() {
    if (!this.currentJob || this.currentJob.status !== "paused") {
      return { success: false, message: "No paused migration found" };
    }
    this.isPaused = false;
    this.currentJob.status = "processing";
    return {
      success: true,
      message: "Migration resumed",
      job: this.currentJob,
    };
  }

  getJobStatus() {
    if (!this.currentJob) {
      return { status: "no_job", message: "No migration job has been started" };
    }

    const progressPercent =
      this.currentJob.totalEscorts > 0
        ? (
            (this.currentJob.processedEscorts / this.currentJob.totalEscorts) *
            100
          ).toFixed(1)
        : 0;

    return {
      job: this.currentJob,
      progress: {
        escorts: `${this.currentJob.processedEscorts}/${this.currentJob.totalEscorts}`,
        images: `${this.currentJob.uploadedImages}/${this.currentJob.totalImages}`,
        percentage: `${progressPercent}%`,
      },
      isProcessing: this.isProcessing,
      isPaused: this.isPaused,
    };
  }

  async cancelMigration() {
    if (!this.isProcessing) {
      return { success: false, message: "No migration in progress" };
    }
    this.isProcessing = false;
    this.isPaused = false;
    this.currentJob!.status = "failed";
    this.currentJob!.errors.push("Migration cancelled by user");
    return { success: true, message: "Migration cancelled" };
  }

  async resetAllMigrationFlags() {
    // Reset all escorts' migration flags to force re-migration
    const escortsRef = collection(db, "escorts");
    const snapshot = await getDocs(escortsRef);
    let count = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      if (data.images && data.images.length > 0) {
        await updateDoc(doc.ref, {
          imagesMigrated: false,
          migrationAttempted: false,
          migrationFailed: false,
        });
        count++;
      }
    }

    console.log(`Reset migration flags for ${count} escorts`);
    return { success: true, resetCount: count };
  }
}

export const migrationQueue = MigrationQueue.getInstance();
