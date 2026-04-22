// lib/services/region.service.ts
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
} from "firebase/firestore";
import { slugify } from "@/lib/utils";

const COLLECTION_NAME = "regions";

export interface IRegion {
  id: string;
  name: string;
  countyCode: string;
  county: string;
  countyNumericCode?: string;
  countyId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  town?: string;
  estate?: string;
  address?: string;
  street?: string;
  postalCode?: string;
  notes?: string;
}

export interface CreateRegionDTO {
  name: string;
  county: string;
  countyNumericCode?: string;
  countyId?: string;
  countyCode?: string;
  town?: string;
  estate?: string;
  address?: string;
  street?: string;
  postalCode?: string;
  notes?: string;
}

// Kenya counties mapping
export const COUNTY_MAP: Record<
  string,
  { code: string; name: string; numericCode: string }
> = {
  mombasa: { code: "mombasa", name: "Mombasa", numericCode: "001" },
  kwale: { code: "kwale", name: "Kwale", numericCode: "002" },
  kilifi: { code: "kilifi", name: "Kilifi", numericCode: "003" },
  "tana-river": { code: "tana-river", name: "Tana River", numericCode: "004" },
  lamu: { code: "lamu", name: "Lamu", numericCode: "005" },
  "taita-taveta": {
    code: "taita-taveta",
    name: "Taita Taveta",
    numericCode: "006",
  },
  garissa: { code: "garissa", name: "Garissa", numericCode: "007" },
  wajir: { code: "wajir", name: "Wajir", numericCode: "008" },
  mandera: { code: "mandera", name: "Mandera", numericCode: "009" },
  marsabit: { code: "marsabit", name: "Marsabit", numericCode: "010" },
  isiolo: { code: "isiolo", name: "Isiolo", numericCode: "011" },
  meru: { code: "meru", name: "Meru", numericCode: "012" },
  "tharaka-nithi": {
    code: "tharaka-nithi",
    name: "Tharaka Nithi",
    numericCode: "013",
  },
  embu: { code: "embu", name: "Embu", numericCode: "014" },
  kitui: { code: "kitui", name: "Kitui", numericCode: "015" },
  machakos: { code: "machakos", name: "Machakos", numericCode: "016" },
  makueni: { code: "makueni", name: "Makueni", numericCode: "017" },
  nyandarua: { code: "nyandarua", name: "Nyandarua", numericCode: "018" },
  nyeri: { code: "nyeri", name: "Nyeri", numericCode: "019" },
  kirinyaga: { code: "kirinyaga", name: "Kirinyaga", numericCode: "020" },
  muranga: { code: "muranga", name: "Murang'a", numericCode: "021" },
  kiambu: { code: "kiambu", name: "Kiambu", numericCode: "022" },
  turkana: { code: "turkana", name: "Turkana", numericCode: "023" },
  "west-pokot": { code: "west-pokot", name: "West Pokot", numericCode: "024" },
  samburu: { code: "samburu", name: "Samburu", numericCode: "025" },
  "trans-nzoia": {
    code: "trans-nzoia",
    name: "Trans Nzoia",
    numericCode: "026",
  },
  "uasin-gishu": {
    code: "uasin-gishu",
    name: "Uasin Gishu",
    numericCode: "027",
  },
  "elgeyo-marakwet": {
    code: "elgeyo-marakwet",
    name: "Elgeyo Marakwet",
    numericCode: "028",
  },
  nandi: { code: "nandi", name: "Nandi", numericCode: "029" },
  baringo: { code: "baringo", name: "Baringo", numericCode: "030" },
  laikipia: { code: "laikipia", name: "Laikipia", numericCode: "031" },
  nakuru: { code: "nakuru", name: "Nakuru", numericCode: "032" },
  narok: { code: "narok", name: "Narok", numericCode: "033" },
  kajiado: { code: "kajiado", name: "Kajiado", numericCode: "034" },
  kericho: { code: "kericho", name: "Kericho", numericCode: "035" },
  bomet: { code: "bomet", name: "Bomet", numericCode: "036" },
  kakamega: { code: "kakamega", name: "Kakamega", numericCode: "037" },
  vihiga: { code: "vihiga", name: "Vihiga", numericCode: "038" },
  bungoma: { code: "bungoma", name: "Bungoma", numericCode: "039" },
  busia: { code: "busia", name: "Busia", numericCode: "040" },
  siaya: { code: "siaya", name: "Siaya", numericCode: "041" },
  kisumu: { code: "kisumu", name: "Kisumu", numericCode: "042" },
  "homa-bay": { code: "homa-bay", name: "Homa Bay", numericCode: "043" },
  migori: { code: "migori", name: "Migori", numericCode: "044" },
  kisii: { code: "kisii", name: "Kisii", numericCode: "045" },
  nyamira: { code: "nyamira", name: "Nyamira", numericCode: "046" },
  nairobi: { code: "nairobi", name: "Nairobi", numericCode: "047" },
};

export class RegionService {
  private static convertDocToRegion(
    doc: QueryDocumentSnapshot<DocumentData>,
  ): IRegion {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      countyCode: data.countyCode,
      county: data.county,
      countyNumericCode: data.countyNumericCode,
      countyId: data.countyId,
      isActive: data.isActive !== false,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      town: data.town,
      estate: data.estate,
      address: data.address,
      street: data.street,
      postalCode: data.postalCode,
      notes: data.notes,
    };
  }

  static async getRegionByNameAndCounty(
    name: string,
    county: string,
  ): Promise<IRegion | null> {
    try {
      const regionsRef = collection(db, COLLECTION_NAME);
      const q = query(
        regionsRef,
        where("name", "==", name),
        where("county", "==", county),
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        return this.convertDocToRegion(snapshot.docs[0]);
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

  static async getCountyInfo(countyName: string) {
    const countySlug = slugify(countyName);
    return (
      COUNTY_MAP[countySlug] || {
        code: countySlug,
        name: countyName,
        numericCode: "",
      }
    );
  }

  static async createRegion(data: CreateRegionDTO): Promise<IRegion> {
    try {
      const slug = slugify(data.name);
      const countySlug = slugify(data.county);
      const regionId = `${countySlug}_${slug}`;

      const existing = await this.getRegionByNameAndCounty(
        data.name,
        data.county,
      );
      if (existing) {
        console.log(`Region already exists: ${data.name} in ${data.county}`);
        return existing;
      }

      const now = new Date();
      const countyInfo = await this.getCountyInfo(data.county);

      const regionData = {
        name: data.name,
        countyCode: countySlug,
        county: data.county,
        countyNumericCode: data.countyNumericCode || countyInfo.numericCode,
        countyId: countySlug,
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
    additionalData?: Partial<CreateRegionDTO>,
  ): Promise<IRegion> {
    const existing = await this.getRegionByNameAndCounty(regionName, county);
    if (existing) {
      console.log(`Found existing region: ${regionName} in ${county}`);
      return existing;
    }

    return await this.createRegion({
      name: regionName,
      county: county,
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
      const q = query(regionsRef, where("county", "==", county));
      const snapshot = await getDocs(q);

      const regions = snapshot.docs.map((doc) => this.convertDocToRegion(doc));
      regions.sort((a, b) => a.name.localeCompare(b.name));

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
      regions.sort((a, b) => {
        if (a.county !== b.county) {
          return a.county.localeCompare(b.county);
        }
        return a.name.localeCompare(b.name);
      });

      return regions;
    } catch (error) {
      console.error("Error getting all regions:", error);
      return [];
    }
  }
}

export default RegionService;
