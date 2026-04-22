// types/region.types.ts
export interface IRegion {
  id: string;
  name: string;
  countyCode: string; // Region's slug (e.g., "kericho")
  county: string; // County name (e.g., "Kericho")
  countyNumericCode?: string; // Original numeric county code (e.g., "035")
  countyId: string; // County slug/ID
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
