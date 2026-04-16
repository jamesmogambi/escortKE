import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

// Serialize a single Firestore document
export function serializeDoc<T = any>(
  doc: QueryDocumentSnapshot<DocumentData>,
): T & { id: string } {
  const data = doc.data();
  const serialized: any = { id: doc.id };

  for (const [key, value] of Object.entries(data)) {
    // Convert Firestore Timestamp to ISO string
    if (value instanceof Timestamp) {
      serialized[key] = value.toDate().toISOString();
    }
    // Convert Date to ISO string
    else if (value instanceof Date) {
      serialized[key] = value.toISOString();
    }
    // Handle nested objects
    else if (value && typeof value === "object" && !Array.isArray(value)) {
      if (value instanceof Timestamp) {
        serialized[key] = value.toDate().toISOString();
      } else {
        serialized[key] = serializeObject(value);
      }
    }
    // Handle arrays
    else if (Array.isArray(value)) {
      serialized[key] = value.map((item) => {
        if (item instanceof Timestamp) {
          return item.toDate().toISOString();
        }
        if (item && typeof item === "object") {
          return serializeObject(item);
        }
        return item;
      });
    } else {
      serialized[key] = value;
    }
  }

  return serialized as T & { id: string };
}

// Serialize a plain object (not from Firestore)
export function serializeObject(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;

  if (obj instanceof Timestamp) {
    return obj.toDate().toISOString();
  }

  if (obj instanceof Date) {
    return obj.toISOString();
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => serializeObject(item));
  }

  const serialized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    serialized[key] = serializeObject(value);
  }
  return serialized;
}

// Serialize an array of documents
export function serializeDocs<T = any>(
  docs: QueryDocumentSnapshot<DocumentData>[],
): (T & { id: string })[] {
  return docs.map((doc) => serializeDoc<T>(doc));
}
