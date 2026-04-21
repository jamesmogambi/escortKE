// lib/firebase-storage.ts
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage, db } from "./firebase";

export { storage };

// Helper function to upload image to Firebase Storage
export async function uploadImageToStorage(
  imageUrl: string,
  escortId: string,
  imageIndex: number,
): Promise<string | null> {
  try {
    // Create a unique filename
    const extension = imageUrl.split(".").pop()?.split("?")[0] || "jpg";
    const fileName = `${escortId}/${Date.now()}_${imageIndex}.${extension}`;
    const storageRef = ref(storage, `escort-images/${fileName}`);

    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const blob = await response.blob();

    // Upload to Firebase Storage
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    console.log(`✅ Uploaded image ${imageIndex + 1} for escort ${escortId}`);
    return downloadUrl;
  } catch (error) {
    console.error(`❌ Failed to upload image for escort ${escortId}:`, error);
    return null;
  }
}

// Helper function to delete images from storage
export async function deleteImagesFromStorage(escortId: string): Promise<void> {
  try {
    const folderRef = ref(storage, `escort-images/${escortId}`);
    // Note: Firebase Storage doesn't have a built-in way to delete folders
    // You'll need to keep track of uploaded file paths or use a separate function
    console.log(`🗑️ Marked for deletion: escort-images/${escortId}`);
  } catch (error) {
    console.error(`Failed to delete images for escort ${escortId}:`, error);
  }
}
