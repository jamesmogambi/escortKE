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
  // Data arrays
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

  // Existing functions
  hydrate: (data: Partial<VariantState>) => void;
  clear: () => void;

  // New individual setters
  setAge: (age: VariantItem[]) => void;
  setBreast: (breast: VariantItem[]) => void;
  setCharacter: (character: VariantItem[]) => void;
  setHairColor: (hairColor: VariantItem[]) => void;
  setNationality: (nationality: VariantItem[]) => void;
  setExperience: (experience: VariantItem[]) => void;
  setLanguages: (languages: VariantItem[]) => void;
  setAvailability: (availability: string[]) => void;
  setCategories: (categories: string[]) => void;
  setPractices: (practices: NamedItem[]) => void;
  setBdsm: (bdsm: NamedItem[]) => void;
  setMassage: (massage: NamedItem[]) => void;

  // CRUD operations for NamedItem arrays
  addPractice: (practice: NamedItem) => void;
  removePractice: (id: number) => void;
  updatePractice: (id: number, name: string) => void;

  addBdsm: (item: NamedItem) => void;
  removeBdsm: (id: number) => void;

  addMassage: (item: NamedItem) => void;
  removeMassage: (id: number) => void;

  // Utility functions
  addVariantItem: (category: keyof VariantState, item: VariantItem) => void;
  removeVariantItem: (category: keyof VariantState, name: string) => void;

  // Bulk operations
  setMultiple: (data: Partial<VariantState>) => void;
  resetToDefaults: () => void;

  // Getters
  getPracticeById: (id: number) => NamedItem | undefined;
  getAllData: () => VariantState;
}

export const useVariantStore = create<VariantState>()(
  persist(
    (set, get) => ({
      // Initial state
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

      // Original functions
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

      // Individual setters
      setAge: (age) => set({ age }),
      setBreast: (breast) => set({ breast }),
      setCharacter: (character) => set({ character }),
      setHairColor: (hairColor) => set({ hairColor }),
      setNationality: (nationality) => set({ nationality }),
      setExperience: (experience) => set({ experience }),
      setLanguages: (languages) => set({ languages }),
      setAvailability: (availability) => set({ availability }),
      setCategories: (categories) => set({ categories }),
      setPractices: (practices) => set({ practices }),
      setBdsm: (bdsm) => set({ bdsm }),
      setMassage: (massage) => set({ massage }),

      // CRUD for practices
      addPractice: (practice) =>
        set((state) => ({
          practices: [...state.practices, practice],
        })),
      removePractice: (id) =>
        set((state) => ({
          practices: state.practices.filter((p) => p.id !== id),
        })),
      updatePractice: (id, name) =>
        set((state) => ({
          practices: state.practices.map((p) =>
            p.id === id ? { ...p, name } : p,
          ),
        })),

      // CRUD for BDSM
      addBdsm: (item) =>
        set((state) => ({
          bdsm: [...state.bdsm, item],
        })),
      removeBdsm: (id) =>
        set((state) => ({
          bdsm: state.bdsm.filter((item) => item.id !== id),
        })),

      // CRUD for massage
      addMassage: (item) =>
        set((state) => ({
          massage: [...state.massage, item],
        })),
      removeMassage: (id) =>
        set((state) => ({
          massage: state.massage.filter((item) => item.id !== id),
        })),

      // Utility functions for VariantItem arrays
      addVariantItem: (category, item) =>
        set((state) => {
          const currentArray = state[category] as VariantItem[];
          return {
            [category]: [...currentArray, item],
          };
        }),

      removeVariantItem: (category, name) =>
        set((state) => {
          const currentArray = state[category] as VariantItem[];
          return {
            [category]: currentArray.filter((item) => item.name !== name),
          };
        }),

      // Bulk operation
      setMultiple: (data) => set({ ...data }),

      // Reset to defaults (same as clear but more descriptive)
      resetToDefaults: () =>
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

      // Getters
      getPracticeById: (id) => {
        const state = get();
        return state.practices.find((p) => p.id === id);
      },

      getAllData: () => get(),
    }),
    {
      name: "variant-store",
      // Optional: Add partial state persistence
      partialize: (state) => ({
        // Persist only specific fields if needed
        practices: state.practices,
        bdsm: state.bdsm,
        massage: state.massage,
      }),
    },
  ),
);
