//

import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  region: string;
  city: string;
  description: string;
  age: string;
  breast: string;
  character: string;
  hairColor: string;
  nationality: string;
  experience: string;
  tags: string[];

  setRegion: (region: string) => void;
  setCity: (city: string) => void;
  setDescription: (description: string) => void;
  setAge: (age: string) => void;
  setBreast: (breast: string) => void;
  setCharacter: (character: string) => void;
  setHairColor: (hairColor: string) => void;
  setNationality: (nationality: string) => void;
  setExperience: (experience: string) => void;
  setTags: (tags: string[]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  clearTags: () => void;

  clearDescription: () => void;
  reset: () => void;
};

export const useFormStore = create(
  persist<State>(
    (set) => ({
      region: "",
      city: "",
      description: "",
      age: "",
      breast: "",
      character: "",
      hairColor: "",
      nationality: "",
      experience: "",
      tags: [],

      setRegion: (region) => set({ region, city: "" }),
      setCity: (city) => set({ city }),
      setDescription: (description) => set({ description }),
      setAge: (age) => set({ age }),
      setBreast: (breast) => set({ breast }),
      setCharacter: (character) => set({ character }),
      setHairColor: (hairColor) => set({ hairColor }),
      setNationality: (nationality) => set({ nationality }),
      setExperience: (experience) => set({ experience }),
      setTags: (tags) => set({ tags }),

      addTag: (tag) =>
        set((state) =>
          state.tags.includes(tag) ? state : { tags: [...state.tags, tag] }
        ),

      removeTag: (tag) =>
        set((state) => ({
          tags: state.tags.filter((t) => t !== tag),
        })),

      clearTags: () => set({ tags: [] }),

      clearDescription: () => set({ description: "" }),

      reset: () =>
        set({
          region: "",
          city: "",
          description: "",
          age: "",
          breast: "",
          character: "",
          hairColor: "",
          nationality: "",
          experience: "",
          tags: [],
        }),
    }),
    {
      name: "form-store", // localStorage key
    }
  )
);
