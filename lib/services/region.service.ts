// lib/services/region.service.ts (updated)
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
  deleteDoc,
} from "firebase/firestore";
import { slugify } from "@/lib/utils";

const COLLECTION_NAME = "regions";

export interface IRegion {
  id: string;
  name: string;
  countyCode: string;
  county?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  town?: string;
  estate?: string;
  address?: string;
  street?: string;
  postalCode?: string;
  notes?: string;
  countyId?: string;
}

export interface CreateRegionDTO {
  name: string;
  county: string;
  countyId?: string;
  countyCode?: string;
  town?: string;
  estate?: string;
  address?: string;
  street?: string;
  postalCode?: string;
  notes?: string;
}

export class RegionService {
  private static convertDocToRegion(
    doc: QueryDocumentSnapshot<DocumentData>,
  ): IRegion {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || data.region || "", // Handle both 'name' and 'region' fields
      countyCode: data.countyCode || data.code || "",
      county: data.county || data.countyName || "",
      isActive: data.isActive !== false,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      town: data.town,
      estate: data.estate,
      address: data.address,
      street: data.street,
      postalCode: data.postalCode,
      notes: data.notes,
      countyId: data.countyId,
    };
  }

  static async getRegionByNameAndCounty(
    name: string,
    county: string,
  ): Promise<IRegion | null> {
    try {
      const regionsRef = collection(db, COLLECTION_NAME);

      // Try exact match first
      let q = query(
        regionsRef,
        where("name", "==", name),
        where("county", "==", county),
      );
      let snapshot = await getDocs(q);

      if (!snapshot.empty) {
        return this.convertDocToRegion(snapshot.docs[0]);
      }

      // Try case-insensitive by using lowercase comparison (client-side)
      const allRegionsQuery = query(regionsRef);
      const allSnapshot = await getDocs(allRegionsQuery);

      for (const doc of allSnapshot.docs) {
        const data = doc.data();
        const docName = data.name || data.region || "";
        const docCounty = data.county || data.countyName || "";

        if (
          docName.toLowerCase() === name.toLowerCase() &&
          docCounty.toLowerCase() === county.toLowerCase()
        ) {
          return this.convertDocToRegion(doc);
        }
      }

      return null;
    } catch (error) {
      console.error("Error getting region:", error);
      return null;
    }
  }

  static async getRegionById(id: string): Promise<IRegion | null> {
    try {
      const regionRef = doc(db, COLLECTION_NAME, id);
      const regionDoc = await getDoc(regionRef);

      if (!regionDoc.exists()) {
        return null;
      }

      return this.convertDocToRegion(
        regionDoc as QueryDocumentSnapshot<DocumentData>,
      );
    } catch (error) {
      console.error("Error getting region by ID:", error);
      return null;
    }
  }

  static async createRegion(data: CreateRegionDTO): Promise<IRegion> {
    try {
      const slug = slugify(data.name);
      const countySlug = slugify(data.county);
      const regionId = `${countySlug}_${slug}`;

      // Check if region already exists (case-insensitive)
      const existing = await this.getRegionByNameAndCounty(
        data.name,
        data.county,
      );
      if (existing) {
        console.log(`Region already exists: ${data.name} in ${data.county}`);
        return existing;
      }

      const now = new Date();

      const regionData = {
        name: data.name,
        countyCode: data.countyCode || countySlug,
        county: data.county,
        countyId: data.countyId || countySlug,
        isActive: true,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        town: data.town || data.name,
        estate: data.estate || "",
        address: data.address || "",
        street: data.street || "",
        postalCode: data.postalCode || "",
        notes: data.notes || `Auto-created from RahaEscorts scraping`,
      };

      const regionRef = doc(db, COLLECTION_NAME, regionId);
      await setDoc(regionRef, regionData);

      console.log(
        `✅ Created new region: ${data.name} in ${data.county} (ID: ${regionId})`,
      );

      return {
        id: regionId,
        ...regionData,
        createdAt: now,
        updatedAt: now,
      };
    } catch (error) {
      console.error("Error creating region:", error);
      throw error;
    }
  }

  static async getOrCreateRegion(
    regionName: string,
    county: string,
    countyId?: string,
    additionalData?: Partial<CreateRegionDTO>,
  ): Promise<IRegion> {
    // Try to find existing region (case-insensitive)
    const existing = await this.getRegionByNameAndCounty(regionName, county);
    if (existing) {
      console.log(`Found existing region: ${regionName} in ${county}`);
      return existing;
    }

    // Create new region
    return await this.createRegion({
      name: regionName,
      county: county,
      countyId: countyId || slugify(county),
      countyCode: slugify(county),
      town: additionalData?.town || regionName,
      estate: additionalData?.estate || "",
      address: additionalData?.address || "",
      street: additionalData?.street || "",
      postalCode: additionalData?.postalCode || "",
      notes: additionalData?.notes || `Auto-created from RahaEscorts scraping`,
    });
  }

  static async getRegionsByCounty(county: string): Promise<IRegion[]> {
    try {
      const regionsRef = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(regionsRef);

      const regions: IRegion[] = [];
      const normalizedCounty = county.toLowerCase();

      for (const doc of snapshot.docs) {
        const data = doc.data();
        const docCounty = (data.county || data.countyName || "").toLowerCase();

        if (docCounty === normalizedCounty) {
          regions.push(this.convertDocToRegion(doc));
        }
      }

      // Sort by name
      regions.sort((a, b) => a.name.localeCompare(b.name));

      console.log(`Found ${regions.length} regions for county: ${county}`);
      return regions;
    } catch (error) {
      console.error("Error getting regions by county:", error);
      return [];
    }
  }

  static async getAllRegions(): Promise<IRegion[]> {
    try {
      const regionsRef = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(regionsRef);

      const regions = snapshot.docs.map((doc) => this.convertDocToRegion(doc));

      // Sort by name
      regions.sort((a, b) => a.name.localeCompare(b.name));

      return regions;
    } catch (error) {
      console.error("Error getting all regions:", error);
      return [];
    }
  }

  static async updateRegion(
    id: string,
    data: Partial<CreateRegionDTO>,
  ): Promise<IRegion | null> {
    try {
      const regionRef = doc(db, COLLECTION_NAME, id);
      const regionDoc = await getDoc(regionRef);

      if (!regionDoc.exists()) {
        return null;
      }

      const updateData: any = {
        updatedAt: Timestamp.fromDate(new Date()),
      };

      if (data.name) updateData.name = data.name;
      if (data.county) updateData.county = data.county;
      if (data.countyCode) updateData.countyCode = data.countyCode;
      if (data.town !== undefined) updateData.town = data.town;
      if (data.estate !== undefined) updateData.estate = data.estate;
      if (data.address !== undefined) updateData.address = data.address;
      if (data.street !== undefined) updateData.street = data.street;
      if (data.postalCode !== undefined)
        updateData.postalCode = data.postalCode;
      if (data.notes !== undefined) updateData.notes = data.notes;

      await updateDoc(regionRef, updateData);

      return await this.getRegionById(id);
    } catch (error) {
      console.error("Error updating region:", error);
      return null;
    }
  }

  static async deleteRegion(
    id: string,
    hardDelete: boolean = false,
  ): Promise<boolean> {
    try {
      const regionRef = doc(db, COLLECTION_NAME, id);

      if (hardDelete) {
        await deleteDoc(regionRef);
      } else {
        await updateDoc(regionRef, {
          isActive: false,
          updatedAt: Timestamp.fromDate(new Date()),
        });
      }

      return true;
    } catch (error) {
      console.error("Error deleting region:", error);
      return false;
    }
  }
}

export default RegionService;
