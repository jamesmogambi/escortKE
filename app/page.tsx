import { getSimpleFeaturedEscorts } from "@/actions/list-escort";
import PassionateMoments from "@/components/blog/PassionateMoments";
import WhyProfile from "@/components/blog/WhyProfile";
import GirlList from "@/components/GirlList";
import GirlRegions from "@/components/GirlRegions";
import { girls } from "@/fixtures/girl";
import { connectToDB, safeClone, serializeMongoDocs } from "@/lib/mongoose";
import { ICounty } from "@/models/County";
import Escort from "@/models/Escort";
import { IRegion } from "@/models/Region";
// import { IRegion } from "@/types/escort.types";

export const metadata = {
  title: "Over 800 girls for sex from all over Kenya - escortke.com",
  description:
    "Find the best escorts in Kenya. Browse profiles with photos, rates, and reviews. Book your perfect companion today!",
  keywords: [
    "escorts Kenya",
    "Kenya escort services",
    "Nairobi escorts",
    "Mombasa escorts",
    "Kisumu escorts",
    "escort profiles Kenya",
    "book escorts Kenya",
    "Kenya companion services",
    "Kenya adult services",
    "Kenya escort agency",
  ],
};
export default async function Home() {
  const { data, count, success, error } = await getSimpleFeaturedEscorts();

  console.log("featured escorts", data);
  return (
    <>
      <GirlRegions />
      <GirlList girls={data} className="max-w-6xl" />

      <WhyProfile className="mt-20" />
      <PassionateMoments className="mt-8" />
    </>
  );
}

// export default async function Home() {
//   let featuredEscorts = [];

//   try {
//     // Connect to database
//     await connectToDB();

//     console.log(
//       "Database connected successfully, fetching featured escorts...",
//     );

//     // Get featured escorts with timeout protection
//     const queryPromise = Escort.find({
//       isActive: true,
//       previewPhoto: { $exists: true, $ne: "" },
//       images: { $exists: true, $ne: [] },
//     })
//       .populate<{ regionDetails: IRegion }>({
//         path: "region",
//         select: "name _id countyCode",
//       })
//       .populate<{ countyDetails: ICounty }>({
//         path: "county",
//         select: "name _id code",
//       })
//       .sort({
//         images: -1,
//         createdAt: -1,
//       })
//       .limit(20)
//       .exec();

//     // Add timeout to the query
//     const timeoutPromise = new Promise((_, reject) => {
//       setTimeout(() => reject(new Error("Database query timeout")), 15000); // 15 second timeout
//     });

//     // Race between query and timeout
//     featuredEscorts = (await Promise.race([
//       queryPromise,
//       timeoutPromise,
//     ])) as any;

//     console.log(
//       `Successfully fetched ${featuredEscorts?.length || 0} featured escorts`,
//     );
//   } catch (error: any) {
//     // Handle specific error types
//     if (error.name === "MongoServerError") {
//       console.error("MongoDB Server Error:", error.message);
//     } else if (error.name === "MongooseError") {
//       console.error("Mongoose Error:", error.message);
//     } else if (error.message === "Database query timeout") {
//       console.error("Query timeout - taking too long to fetch data");
//     } else if (error.code === "ETIMEDOUT") {
//       console.error("Network timeout error:", error.message);
//     } else {
//       console.error("Unexpected error fetching featured escorts:", error);
//     }

//     // Log more details for debugging
//     console.error("Error details:", {
//       name: error.name,
//       message: error.message,
//       code: error.code,
//       stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
//     });

//     // Use empty array as fallback
//     featuredEscorts = [];
//   }

//   // Safely process the escorts data
//   let processedEscorts = [];

//   try {
//     if (featuredEscorts && Array.isArray(featuredEscorts)) {
//       processedEscorts = safeClone(featuredEscorts);
//       console.log(`Processed ${processedEscorts.length} escorts for display`);
//     } else {
//       console.warn("Featured escorts is not an array, using empty array");
//       processedEscorts = [];
//     }
//   } catch (processError: any) {
//     console.error("Error processing escorts data:", processError.message);
//     processedEscorts = [];
//   }

//   return (
//     <>
//       <GirlRegions />

//       {/* Display escorts or fallback message */}
//       {processedEscorts.length > 0 ? (
//         <GirlList girls={processedEscorts} className="max-w-6xl" />
//       ) : (
//         <div className="max-w-6xl mx-auto py-12 text-center">
//           <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-16 w-16 mx-auto text-gray-500 mb-4"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//             <h3 className="text-xl font-semibold text-white mb-2">
//               No Profiles Available
//             </h3>
//             <p className="text-gray-400 mb-4">
//               We&apos;re having trouble loading profiles at the moment.
//             </p>
//             <p className="text-sm text-gray-500">
//               Please try refreshing the page or check back later.
//             </p>
//           </div>
//         </div>
//       )}

//       <WhyProfile className="mt-20" />
//       <PassionateMoments className="mt-8" />
//     </>
//   );
// }
