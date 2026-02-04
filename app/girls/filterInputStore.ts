import { create } from "zustand";

interface LocationStore {
  counties: any;
  regions: any;
  practices: any;
  setCounties: (counties: string[]) => void;
  setRegions: (locations: string[]) => void;
  setPractices: (practices: string[]) => void;
  reset: () => void;
}

export const useFilterInputStore = create<LocationStore>((set) => ({
  counties: [],
  regions: [],
  practices: [],
  setCounties: (counties) => set({ counties }),
  setRegions: (regions) => set({ regions }),
  setPractices: (practices) => set({ practices }),
  reset: () => set({ counties: [], regions: [], practices: [] }),
}));
