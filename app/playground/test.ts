// // app/actions/getFeaturedEscorts.ts
// "use server";

// import { connectToDB } from "@/lib/mongoose";
// import Escort from "@/models/Escort";
// import { IRegion } from "@/models/Region";
// import { ICounty } from "@/models/County";
// import { safeClone } from "@/lib/mongoose";

// // Define the return type
// export interface FeaturedEscort {
//   _id: string;
//   name?: string;
//   username?: string;
//   age?: string;
//   telephone?: string;
//   whatsappPhone?: string;
//   images: string[];
//   videos: string[];
//   previewPhoto?: string;
//   region?: string | { _id: string; name: string; countyCode?: string };
//   county?: string | { _id: string; name: string; code?: string };
//   town?: string;
//   estate?: string;
//   slug?: string;
//   displayLocation?: string;
//   // Add other fields you need
// }

// // Server action function
// export async function getFeaturedEscortsAction(limit: number = 20): Promise<{
//   success: boolean;
//   data: FeaturedEscort[];
//   error?: string;
//   count: number;
// }> {
//   try {
//     console.log(`[Server Action] Fetching ${limit} featured escorts...`);

//     // Connect to database
//     await connectToDB();

//     // Execute query with timeout protection
//     const queryPromise = Escort.find({
//       isActive: true,
//       previewPhoto: { $exists: true, $ne: "" },
//       images: { $exists: true, $ne: [] },
//     })
//       .populate<{ region: IRegion }>({
//         path: "region",
//         select: "name _id countyCode",
//       })
//       .populate<{ county: ICounty }>({
//         path: "county",
//         select: "name _id code",
//       })
//       .sort({
//         images: -1,
//         createdAt: -1,
//       })
//       .limit(limit)
//       .maxTimeMS(10000); // 10 second timeout

//     // Add a timeout to prevent hanging
//     const timeoutPromise = new Promise((_, reject) => {
//       setTimeout(
//         () => reject(new Error("Query timeout after 15 seconds")),
//         15000,
//       );
//     });

//     const escorts = (await Promise.race([
//       queryPromise,
//       timeoutPromise,
//     ])) as any[];

//     console.log(
//       `[Server Action] Successfully fetched ${escorts.length} escorts`,
//     );

//     // Transform the data for the component
//     const transformedData = escorts.map((escort) => {
//       // Extract region name (could be object or string)
//       const regionName =
//         escort.region && typeof escort.region === "object"
//           ? (escort.region as any).name
//           : escort.region || "";

//       // Extract county name (could be object or string)
//       const countyName =
//         escort.county && typeof escort.county === "object"
//           ? (escort.county as any).name
//           : escort.county || "";

//       // Build display location
//       const locationParts = [];
//       if (escort.estate) locationParts.push(escort.estate);
//       if (escort.town) locationParts.push(escort.town);
//       if (regionName) locationParts.push(regionName);
//       if (countyName) locationParts.push(`${countyName} County`);

//       const displayLocation =
//         locationParts.length > 0
//           ? locationParts.join(", ")
//           : "Location not specified";

//       return {
//         _id: escort._id.toString(),
//         name: escort.name,
//         username: escort.username,
//         age: escort.age,
//         telephone: escort.telephone,
//         whatsappPhone: escort.whatsappPhone,
//         images: escort.images || [],
//         videos: escort.videos || [],
//         previewPhoto: escort.previewPhoto,
//         region: regionName, // Convert to string
//         county: countyName, // Convert to string
//         town: escort.town,
//         estate: escort.estate,
//         slug: escort.slug,
//         displayLocation,
//         // Add other fields you need
//         labels: escort.labels || [],
//         categories: escort.categories || [],
//         isVerified: escort.isVerified,
//         plan: escort.plan,
//       };
//     });

//     // Use safeClone if needed (remove sensitive data)
//     const safeData = safeClone(transformedData);

//     return {
//       success: true,
//       data: safeData,
//       count: safeData.length,
//     };
//   } catch (error: any) {
//     console.error("[Server Action] Error fetching featured escorts:", error);

//     let errorMessage = "Failed to fetch featured escorts";

//     if (error.message?.includes("timeout")) {
//       errorMessage = "Request timeout. Please try again.";
//     } else if (error.name?.includes("Mongo")) {
//       errorMessage = "Database connection error.";
//     }

//     return {
//       success: false,
//       data: [],
//       error: errorMessage,
//       count: 0,
//     };
//   }
// }

// // Optional: Simplified version without population (faster)
// export async function getSimpleFeaturedEscortsAction(limit: number = 15) {
//   try {
//     await connectToDB();

//     const escorts = await Escort.find({
//       isActive: true,
//       previewPhoto: { $exists: true, $ne: "" },
//     })
//       .select(
//         "name username age telephone images previewPhoto slug town region county",
//       )
//       .sort({ createdAt: -1 })
//       .limit(limit)
//       .lean()
//       .exec();

//     const transformed = escorts.map((escort) => ({
//       _id: escort._id.toString(),
//       name: escort.name,
//       username: escort.username,
//       age: escort.age,
//       telephone: escort.telephone,
//       images: escort.images || [],
//       videos: [],
//       previewPhoto: escort.previewPhoto,
//       region: escort.region || "",
//       county: escort.county || "",
//       town: escort.town || "",
//       slug: escort.slug,
//     }));

//     return {
//       success: true,
//       data: transformed,
//       count: transformed.length,
//     };
//   } catch (error) {
//     console.error("Error in simple fetch:", error);
//     return {
//       success: false,
//       data: [],
//       count: 0,
//       error: "Failed to fetch data",
//     };
//   }
// }
