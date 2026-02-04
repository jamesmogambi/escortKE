// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// type FileMeta = {
//   id: string;
//   name: string;
//   type: "image" | "video" | "file";
//   previewUrl?: any;
// };

// function generateThumbnail(videoFile: File): Promise<string> {
//   return new Promise((resolve) => {
//     const video = document.createElement("video");
//     video.src = URL.createObjectURL(videoFile);
//     video.currentTime = 5; // snapshot at 5 seconds

//     video.onloadeddata = () => {
//       const canvas = document.createElement("canvas");
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       const ctx = canvas.getContext("2d");
//       ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
//       resolve(canvas.toDataURL("image/jpeg"));
//     };
//   });
// }
// interface FileStore {
//   files: FileMeta[];
//   fileMap: Map<string, File>; // not persisted
//   addFiles: (newFiles: File[]) => void;
//   removeFile: (id: string) => void;
//   clearFiles: () => void;
//   getFileById: (id: string) => File | undefined;
// }

// export const useFileStore = create<FileStore>()(
//   persist(
//     (set, get) => ({
//       files: [],
//       fileMap: new Map(),

//       addFiles: (newFiles) => {
//         const newMeta: FileMeta[] = [];
//         const updatedMap = new Map(get().fileMap);

//         newFiles.forEach((file) => {
//           const id = crypto.randomUUID();
//           const mime = file.type;
//           const isImage = mime.startsWith("image/");
//           const isVideo = mime.startsWith("video/");
//           const previewUrl =
//             isImage || isVideo ? URL.createObjectURL(file) : undefined;
//           // const previewUrl = isImage
//           //   ? URL.createObjectURL(file)
//           //   : isVideo
//           //   ? generateThumbnail(file)
//           //   : undefined;
//           newMeta.push({
//             id,
//             name: file.name,
//             type: isImage ? "image" : isVideo ? "video" : "file",
//             previewUrl,
//           });

//           updatedMap.set(id, file);
//         });

//         set((state) => ({
//           files: [...state.files, ...newMeta],
//           fileMap: updatedMap,
//         }));
//       },

//       removeFile: (id) => {
//         const fileMeta = get().files.find((f) => f.id === id);
//         if (fileMeta?.previewUrl) URL.revokeObjectURL(fileMeta.previewUrl);

//         const updatedMap = new Map(get().fileMap);
//         updatedMap.delete(id);

//         set((state) => ({
//           files: state.files.filter((f) => f.id !== id),
//           fileMap: updatedMap,
//         }));
//       },

//       clearFiles: () => {
//         get().files.forEach(
//           (f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl)
//         );
//         set(() => ({
//           files: [],
//           fileMap: new Map(),
//         }));
//       },

//       getFileById: (id) => get().fileMap.get(id),
//     }),
//     {
//       name: "file-meta-store",
//       partialize: (state) => ({ files: state.files }), // persist only metadata
//     }
//   )
// );

// Option 2

// store/fileStore.ts
import { create } from "zustand";

interface FileStore {
  existingImages: string[];
  files: File[];

  setExistingImages: (urls: string[]) => void;
  addFiles: (files: File[]) => void;
  removeExistingImage: (url: string) => void;
  removeFile: (index: number) => void;

  clearFiles: () => void;
}

export const useFileStore = create<FileStore>((set) => ({
  existingImages: [],
  files: [],

  setExistingImages: (urls) => set({ existingImages: urls }),

  // addFiles: (newFiles) =>
  //   set((state) => ({
  //     files: [...state.files, ...newFiles],
  //   })),
  addFiles: (newFiles) =>
    set((state) => ({
      files: [...state.files, ...newFiles],
    })),

  removeExistingImage: (url) =>
    set((state) => ({
      existingImages: state.existingImages.filter((img) => img !== url),
    })),

  removeFile: (index) =>
    set((state) => ({
      files: state.files.filter((_, i) => i !== index),
    })),

  clearFiles: () =>
    set({
      files: [],
      existingImages: [],
    }),
}));
