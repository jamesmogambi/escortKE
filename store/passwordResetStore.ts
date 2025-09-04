// // stores/emailStore.ts
// import { create } from "zustand";

// interface EmailStore {
//   email: string;
//   setEmail: (email: string) => void;
//   getEmail: () => string;
//   clearEmail: () => void;
// }

// export const useEmailStore = create<EmailStore>((set, get) => ({
//   email: "",
//   setEmail: (email) => set({ email }),
//   getEmail: () => get().email,
//   clearEmail: () => set({ email: "" }),
// }));

// stores/userInputStore.ts
import { create } from "zustand";

interface UserInputStore {
  email: string;
  code: string;

  // Email methods
  setEmail: (email: string) => void;
  getEmail: () => string;
  clearEmail: () => void;

  // Code methods
  setCode: (code: string) => void;
  getCode: () => string;
  clearCode: () => void;
  appendToCode: (fragment: string) => void;
  removeLastCharFromCode: () => void;
  normalizeCode: () => void;

  // Reset all
  resetAll: () => void;
}

export const useUserInputStore = create<UserInputStore>((set, get) => ({
  email: "",
  code: "",

  // Email
  setEmail: (email) => set({ email }),
  getEmail: () => get().email,
  clearEmail: () => set({ email: "" }),

  // Code
  setCode: (code) => set({ code }),
  getCode: () => get().code,
  clearCode: () => set({ code: "" }),
  appendToCode: (fragment) => set({ code: get().code + fragment }),
  removeLastCharFromCode: () => set({ code: get().code.slice(0, -1) }),
  normalizeCode: () => set({ code: get().code.trim().toUpperCase() }),

  // Reset all
  resetAll: () => set({ email: "", code: "" }),
}));
