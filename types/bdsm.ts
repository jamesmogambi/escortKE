// types/bdsm.ts
export interface BDSMPractice {
  id: number;
  name: string;
}

export interface Escort {
  _id: string;
  name: string;
  county: string;
  region: string;
  bdsm: BDSMPractice[];
}

export interface BDSMFilterParams {
  county?: string;
  region?: string;
  practice?: string;
  page?: string;
}

export interface PaginatedResponse {
  escorts: Escort[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
