// types/region.types.ts
export interface IRegion {
  id: string;
  name: string; // Region name (e.g., "Samburu North")
  countyCode: string; // e.g., "025"
  county?: string; // County name (e.g., "Samburu")
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Optional fields
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
