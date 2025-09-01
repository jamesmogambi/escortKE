import { create } from "zustand";
import { persist } from "zustand/middleware";

type FileMeta = {
  id: string;
  name: string;
  type: "image" | "video" | "file";
  previewUrl?: string;
};

interface FileStore {
  files: FileMeta[];
  fileMap: Map<string, File>; // not persisted
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  getFileById: (id: string) => File | undefined;
}

export const useFileStore = create<FileStore>()(
  persist(
    (set, get) => ({
      files: [],
      fileMap: new Map(),

      addFiles: (newFiles) => {
        const newMeta: FileMeta[] = [];
        const updatedMap = new Map(get().fileMap);

        newFiles.forEach((file) => {
          const id = crypto.randomUUID();
          const mime = file.type;
          const isImage = mime.startsWith("image/");
          const isVideo = mime.startsWith("video/");
          const previewUrl =
            isImage || isVideo ? URL.createObjectURL(file) : undefined;

          newMeta.push({
            id,
            name: file.name,
            type: isImage ? "image" : isVideo ? "video" : "file",
            previewUrl,
          });

          updatedMap.set(id, file);
        });

        set((state) => ({
          files: [...state.files, ...newMeta],
          fileMap: updatedMap,
        }));
      },

      removeFile: (id) => {
        const fileMeta = get().files.find((f) => f.id === id);
        if (fileMeta?.previewUrl) URL.revokeObjectURL(fileMeta.previewUrl);

        const updatedMap = new Map(get().fileMap);
        updatedMap.delete(id);

        set((state) => ({
          files: state.files.filter((f) => f.id !== id),
          fileMap: updatedMap,
        }));
      },

      clearFiles: () => {
        get().files.forEach(
          (f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl)
        );
        set(() => ({
          files: [],
          fileMap: new Map(),
        }));
      },

      getFileById: (id) => get().fileMap.get(id),
    }),
    {
      name: "file-meta-store",
      partialize: (state) => ({ files: state.files }), // persist only metadata
    }
  )
);
