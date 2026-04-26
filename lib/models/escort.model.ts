// lib/models/escort.model.ts
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
} from "firebase/firestore";
import {
  IEscort,
  CreateEscortDTO,
  UpdateEscortDTO,
  GetEscortsParams,
} from "@/types/escort.types";

const COLLECTION_NAME = "escorts";

export class EscortModel {
  // Create a new escort (independent or agency-owned)
  static async create(
    data: CreateEscortDTO,
    agencyId?: string,
  ): Promise<IEscort> {
    try {
      if (!db) {
        throw new Error("Firebase db not initialized");
      }

      let isAgencyOwned = false;
      let agencyData = null;

      // If agencyId is provided, verify agency exists and has capacity
      if (agencyId) {
        const agencyRef = doc(db, "agencies", agencyId);
        const agencyDoc = await getDoc(agencyRef);

        if (!agencyDoc.exists()) {
          throw new Error("Agency not found");
        }

        agencyData = agencyDoc.data();
        const currentEmployeesCount = agencyData.featuredEmployeesCount || 0;

        if (currentEmployeesCount >= agencyData.plan?.maxEmployees) {
          throw new Error(
            `Maximum employees limit (${agencyData.plan?.maxEmployees}) reached for this agency's plan`,
          );
        }

        isAgencyOwned = true;
      }

      // Generate slug from name
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const now = new Date();
      const escortData: any = {
        ...data,
        slug: `${slug}-${Date.now()}`,
        agencyId: agencyId || null,
        isAgencyOwned,
        gender: data.gender || "female",
        ethnicity: data.ethnicity || [],
        nationality: data.nationality || "",
        languages: data.languages || ["English"],
        height: data.height || 0,
        weight: data.weight || 0,
        hairColor: data.hairColor || "",
        eyeColor: data.eyeColor || "",
        services: data.services || [],
        specialties: [],
        availability: {
          monday: { start: "09:00", end: "23:00", available: true },
          tuesday: { start: "09:00", end: "23:00", available: true },
          wednesday: { start: "09:00", end: "23:00", available: true },
          thursday: { start: "09:00", end: "23:00", available: true },
          friday: { start: "09:00", end: "23:00", available: true },
          saturday: { start: "10:00", end: "02:00", available: true },
          sunday: { start: "10:00", end: "22:00", available: true },
        },
        pricing: data.pricing || {
          incall: { hour: 200, twoHours: 350, overnight: 1000 },
          outcall: { hour: 250, twoHours: 450, overnight: 1200 },
        },
        profileImage: data.profileImage || "",
        gallery: data.gallery || [], // Ensure gallery is included
        // gallery: [],
        videos: [],
        country: data.country || "Kenya",
        county: data.county || "Nairobi",
        region: data.region || "Nairobi Central",
        town: data.town || "Nairobi CBD",
        isVerified: false,
        verificationStatus: "pending",
        rating: 0,
        totalReviews: 0,
        totalBookings: 0,
        totalViews: 0,
        isActive: true,
        isFeatured: false,
        isAvailable: true,
        joinedDate: now,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), escortData);

      // If agency-owned, update agency's employee count
      if (isAgencyOwned && agencyId) {
        const agencyRef = doc(db, "agencies", agencyId);
        await updateDoc(agencyRef, {
          featuredEmployeesCount: increment(1),
          updatedAt: now,
        });
      }

      return { id: docRef.id, ...escortData } as IEscort;
    } catch (error) {
      console.error("Error creating escort:", error);
      throw error;
    }
  }

  // Get escort by ID
  static async getById(id: string): Promise<IEscort | null> {
    try {
      if (!db) {
        throw new Error("Firebase db not initialized");
      }

      console.log("Getting escort with ID:", id);
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Escort found:", data);

        // Increment view count asynchronously (don't await to not block response)
        updateDoc(docRef, {
          totalViews: increment(1),
        }).catch((err) => console.error("Error incrementing view count:", err));

        return { id: docSnap.id, ...data } as IEscort;
      }

      console.log("Escort not found with ID:", id);
      return null;
    } catch (error) {
      console.error("Error getting escort:", error);
      throw error;
    }
  }

  // Get all escorts with filters
  static async getAll(
    params: GetEscortsParams = {},
  ): Promise<{ escorts: IEscort[]; total: number; hasMore: boolean }> {
    try {
      if (!db) {
        throw new Error("Firebase db not initialized");
      }

      const {
        page = 1,
        limit: limitCount = 20,
        agencyId,
        isAvailable,
        isVerified,
        minAge,
        maxAge,
        services,
        minPrice,
        maxPrice,
        county,
        region,
        town,
        isAgencyOwned,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = params;

      let constraints: any[] = [];

      if (agencyId) {
        constraints.push(where("agencyId", "==", agencyId));
      }

      if (isAvailable !== undefined) {
        constraints.push(where("isAvailable", "==", isAvailable));
      }

      if (isVerified !== undefined) {
        constraints.push(where("isVerified", "==", isVerified));
      }

      if (isAgencyOwned !== undefined) {
        constraints.push(where("isAgencyOwned", "==", isAgencyOwned));
      }

      if (minAge) {
        constraints.push(where("age", ">=", minAge));
      }

      if (maxAge) {
        constraints.push(where("age", "<=", maxAge));
      }

      if (county) {
        constraints.push(where("county", "==", county));
      }

      if (region) {
        constraints.push(where("region", "==", region));
      }

      if (town) {
        constraints.push(where("town", "==", town));
      }

      if (services && services.length > 0) {
        constraints.push(where("services", "array-contains-any", services));
      }

      constraints.push(orderBy(sortBy, sortOrder));
      constraints.push(limit(limitCount));

      const q = query(collection(db, COLLECTION_NAME), ...constraints);
      const querySnapshot = await getDocs(q);

      const escorts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as IEscort[];

      // Filter by price range (client-side as pricing is nested)
      let filteredEscorts = escorts;
      if (minPrice || maxPrice) {
        filteredEscorts = escorts.filter((escort) => {
          const price = escort.pricing?.incall?.hour || 0;
          if (minPrice && price < minPrice) return false;
          if (maxPrice && price > maxPrice) return false;
          return true;
        });
      }

      return {
        escorts: filteredEscorts,
        total: filteredEscorts.length,
        hasMore: filteredEscorts.length === limitCount,
      };
    } catch (error) {
      console.error("Error getting escorts:", error);
      throw error;
    }
  }

  // Get escorts by agency
  static async getByAgencyId(
    agencyId: string,
    params: Omit<GetEscortsParams, "agencyId"> = {},
  ): Promise<{ escorts: IEscort[]; total: number; hasMore: boolean }> {
    return this.getAll({ ...params, agencyId });
  }

  // Update escort
  static async update(id: string, data: UpdateEscortDTO): Promise<void> {
    try {
      if (!db) {
        throw new Error("Firebase db not initialized");
      }

      const docRef = doc(db, COLLECTION_NAME, id);
      const oldData = await getDoc(docRef);

      if (!oldData.exists()) {
        throw new Error("Escort not found");
      }

      const oldEscort = oldData.data();
      const updateData: any = {
        ...data,
        updatedAt: new Date(),
      };

      // Handle agency assignment changes
      if (data.agencyId !== undefined && oldEscort.agencyId !== data.agencyId) {
        // Remove from old agency
        if (oldEscort.agencyId) {
          const oldAgencyRef = doc(db, "agencies", oldEscort.agencyId);
          await updateDoc(oldAgencyRef, {
            featuredEmployeesCount: increment(-1),
            updatedAt: new Date(),
          });
        }

        // Add to new agency
        if (data.agencyId) {
          const newAgencyRef = doc(db, "agencies", data.agencyId);
          const newAgencyDoc = await getDoc(newAgencyRef);

          if (!newAgencyDoc.exists()) {
            throw new Error("New agency not found");
          }

          const newAgency = newAgencyDoc.data();
          if (
            newAgency.featuredEmployeesCount >= newAgency.plan?.maxEmployees
          ) {
            throw new Error(
              `Maximum employees limit reached for the new agency`,
            );
          }

          await updateDoc(newAgencyRef, {
            featuredEmployeesCount: increment(1),
            updatedAt: new Date(),
          });

          updateData.isAgencyOwned = true;
        } else {
          updateData.isAgencyOwned = false;
        }
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("Error updating escort:", error);
      throw error;
    }
  }

  // Delete escort
  static async delete(id: string): Promise<void> {
    try {
      if (!db) {
        throw new Error("Firebase db not initialized");
      }

      const escortDoc = await getDoc(doc(db, COLLECTION_NAME, id));

      if (!escortDoc.exists()) {
        throw new Error("Escort not found");
      }

      const escort = escortDoc.data();

      // If agency-owned, decrease agency's employee count
      if (escort.isAgencyOwned && escort.agencyId) {
        const agencyRef = doc(db, "agencies", escort.agencyId);
        await updateDoc(agencyRef, {
          featuredEmployeesCount: increment(-1),
          updatedAt: new Date(),
        });
      }

      // Delete the escort document
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting escort:", error);
      throw error;
    }
  }

  // Upload gallery images for an escort
  static async uploadGallery(
    escortId: string,
    files: File[],
    agencyId?: string,
  ): Promise<string[]> {
    try {
      if (!db) {
        throw new Error("Firebase db not initialized");
      }

      const uploadedUrls: string[] = [];
      const escortRef = doc(db, COLLECTION_NAME, escortId);
      const escortDoc = await getDoc(escortRef);

      if (!escortDoc.exists()) {
        throw new Error("Escort not found");
      }

      const escort = escortDoc.data();
      const currentGallery = Array.isArray(escort.gallery)
        ? escort.gallery
        : [];

      // Import storage here to avoid circular dependencies
      const { storage } = await import("@/lib/firebase");
      const { ref, uploadBytes, getDownloadURL } = await import(
        "firebase/storage"
      );

      for (const file of files) {
        const extension = file.name.split(".").pop() || "jpg";
        const fileName = `escort_${escortId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${extension}`;
        const storagePath = agencyId
          ? `agencies/${agencyId}/escorts/${escortId}/gallery/${fileName}`
          : `escorts/${escortId}/gallery/${fileName}`;

        const storageRef = ref(storage, storagePath);
        const buffer = Buffer.from(await file.arrayBuffer());
        await uploadBytes(storageRef, buffer, { contentType: file.type });
        const downloadUrl = await getDownloadURL(storageRef);
        uploadedUrls.push(downloadUrl);
      }

      await updateDoc(escortRef, {
        gallery: [...currentGallery, ...uploadedUrls],
        updatedAt: new Date(),
      });

      return uploadedUrls;
    } catch (error) {
      console.error("Error uploading gallery:", error);
      throw error;
    }
  }
}
