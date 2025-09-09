import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VariantItem {
  name: string;
  flag?: string;
}

interface NamedItem {
  id: number;
  name: string;
}

interface VariantState {
  age: VariantItem[];
  breast: VariantItem[];
  character: VariantItem[];
  hairColor: VariantItem[];
  nationality: VariantItem[];
  experience: VariantItem[];
  languages: VariantItem[];
  availability: string[];
  categories: string[];
  practices: NamedItem[];
  bdsm: NamedItem[];
  massage: NamedItem[];
  hydrate: (data: Partial<VariantState>) => void;
  clear: () => void;
}

export const useVariantStore = create<VariantState>()(
  persist(
    (set) => ({
      age: [],
      breast: [],
      character: [],
      hairColor: [],
      nationality: [],
      experience: [],
      languages: [],
      availability: [],
      categories: [],
      practices: [],
      bdsm: [],
      massage: [],
      hydrate: (data) => set({ ...data }),
      clear: () =>
        set({
          age: [],
          breast: [],
          character: [],
          hairColor: [],
          nationality: [],
          experience: [],
          languages: [],
          availability: [],
          categories: [],
          practices: [],
          bdsm: [],
          massage: [],
        }),
    }),
    {
      name: "variant-store", // localStorage key
    }
  )
);
