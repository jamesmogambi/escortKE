import mongoose from "mongoose";

let isConnected = false; // Variable to track the connection status

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI)
    return console.log("MONGODB_URI is not defined");

  if (isConnected) return console.log("=> using existing database connection");

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "escortDB", // 👈 Specify your desired DB name here
    });

    isConnected = true;

    console.log("MongoDB Connected ");
  } catch (error) {
    console.log(error);
  }
};

export async function getTotalPages(itemsPerPage = 50, modelName = "Video") {
  const ITEMS_PER_PAGE = itemsPerPage;
  try {
    // Dynamically get the model
    const Model =
      mongoose.models[modelName] ||
      mongoose.model(modelName, new mongoose.Schema({}, { strict: false }));

    // Count total documents
    const totalItems = await Model.countDocuments();

    // Calculate total pages
    return Math.ceil(totalItems / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Error fetching total pages:", error);
    return 1; // Default to 1 page if there's an error
  }
}

/**
 * Safely serializes MongoDB documents for client-side consumption.
 * Converts ObjectId, Date, and other BSON types to plain JSON.
 *
 * @param docs - Array of MongoDB documents
 * @returns Deep-cloned, JSON-safe data
 */
export function serializeMongoDocs<T>(docs: T[]): T[] {
  return JSON.parse(JSON.stringify(docs));
}

/**
 * Deep clones a MongoDB document by stripping out non-serializable fields.
 * Useful for sending clean data to the client.
 */
export function safeClone<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}
