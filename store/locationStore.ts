import { Region, Town } from "@/types/globals";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface LocationState {
  regions: Region[];
  towns: Town[];
  setRegions: (regions: Region[]) => void;
  setTowns: (towns: Town[]) => void;
  hydrate: (data: { regions: Region[]; towns: Town[] }) => void;
  clear: () => void;
}

export const useLocationStore = create<LocationState>()(
  devtools(
    persist(
      (set) => ({
        regions: [],
        towns: [],
        setRegions: (regions) => set({ regions }),
        setTowns: (towns) => set({ towns }),
        hydrate: (data) => set({ regions: data.regions, towns: data.towns }),
        clear: () => set({ regions: [], towns: [] }),
      }),
      {
        name: "location-store", // localStorage key
      }
    )
  )
);
