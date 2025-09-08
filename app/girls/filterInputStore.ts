import { create } from "zustand";

interface LocationStore {
  regions: any;
  towns: any;
  practices: any;
  setRegions: (regions: string[]) => void;
  setTowns: (towns: string[]) => void;
  setPractices: (practices: string[]) => void;
  reset: () => void;
}

export const useFilterInputStore = create<LocationStore>((set) => ({
  regions: [],
  towns: [],
  practices: [],
  setRegions: (regions) => set({ regions }),
  setTowns: (towns) => set({ towns }),
  setPractices: (practices) => set({ practices }),
  reset: () => set({ regions: [], towns: [], practices: [] }),
}));
