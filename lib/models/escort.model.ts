// lib/models/escort.model.ts
import {db} from "@/lib/firebase";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    increment,
    limit,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import {CreateEscortDTO, GetEscortsParams, IEscort, UpdateEscortDTO,} from "@/types/escort.types";

const COLLECTION_NAME = "escorts";

export class EscortModel {
    // Create a new escort (independent or agency-owned)
    // services/escortService.ts or wherever your create function is

    static async create(
        data: CreateEscortDTO,
        agencyId?: string,
    ): Promise<IEscort> {
        try {
            if (!db) {
                throw new Error("Firebase db not initialized");
            }

            let isAgencyOwned = false;
            let agencyData = null;

            // If agencyId is provided, verify agency exists and has capacity
            if (agencyId) {
                const agencyRef = doc(db, "agencies", agencyId);
                const agencyDoc = await getDoc(agencyRef);

                if (!agencyDoc.exists()) {
                    throw new Error("Agency not found");
                }

                agencyData = agencyDoc.data();
                const currentEmployeesCount = agencyData.featuredEmployeesCount || 0;

                if (currentEmployeesCount >= agencyData.plan?.maxEmployees) {
                    throw new Error(
                        `Maximum employees limit (${agencyData.plan?.maxEmployees}) reached for this agency's plan`,
                    );
                }

                isAgencyOwned = true;
            }

            // Generate slug from name
            const baseSlug = data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");

            const slug = `${baseSlug}-${Date.now()}`;

            const now = new Date();

            // Build availability array for the Escort interface
            const availabilityArray: string[] = [];
            if (data.availability) {
                Object.entries(data.availability).forEach(
                    ([day, value]: [string, any]) => {
                        if (value?.available) {
                            availabilityArray.push(
                                day.charAt(0).toUpperCase() + day.slice(1),
                            );
                        }
                    },
                );
            } else {
                // Default availability (all days)
                availabilityArray.push(
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                );
            }

            // Build rates array from pricing
            const rates: any[] = [];
            if (data.pricing) {
                if (data.pricing.incall?.hour || data.pricing.outcall?.hour) {
                    rates.push({
                        duration: "1 Hour",
                        incall: data.pricing.incall?.hour?.toString() || "0",
                        outcall: data.pricing.outcall?.hour?.toString() || "0",
                    });
                }
                if (data.pricing.incall?.twoHours || data.pricing.outcall?.twoHours) {
                    rates.push({
                        duration: "2 Hours",
                        incall: data.pricing.incall?.twoHours?.toString() || "0",
                        outcall: data.pricing.outcall?.twoHours?.toString() || "0",
                    });
                }
                if (data.pricing.incall?.overnight || data.pricing.outcall?.overnight) {
                    rates.push({
                        duration: "Overnight",
                        incall: data.pricing.incall?.overnight?.toString() || "0",
                        outcall: data.pricing.outcall?.overnight?.toString() || "0",
                    });
                }
            }

            // Build opening hours object
            const openingHours = {
                monday: data.availability?.monday
                    ? `${data.availability.monday.start}-${data.availability.monday.end}`
                    : "09:00-23:00",
                tuesday: data.availability?.tuesday
                    ? `${data.availability.tuesday.start}-${data.availability.tuesday.end}`
                    : "09:00-23:00",
                wednesday: data.availability?.wednesday
                    ? `${data.availability.wednesday.start}-${data.availability.wednesday.end}`
                    : "09:00-23:00",
                thursday: data.availability?.thursday
                    ? `${data.availability.thursday.start}-${data.availability.thursday.end}`
                    : "09:00-23:00",
                friday: data.availability?.friday
                    ? `${data.availability.friday.start}-${data.availability.friday.end}`
                    : "09:00-23:00",
                saturday: data.availability?.saturday
                    ? `${data.availability.saturday.start}-${data.availability.saturday.end}`
                    : "10:00-02:00",
                sunday: data.availability?.sunday
                    ? `${data.availability.sunday.start}-${data.availability.sunday.end}`
                    : "10:00-22:00",
            };

            // Build locations array
            const locations = [
                {
                    region: data.region || data.primaryRegion || "Nairobi Central",
                    town: data.town || "Nairobi CBD",
                    estate: data.estate || "",
                    address: data.address || "",
                    street: data.street || "",
                    postalCode: data.postalCode || "",
                    isActive: true,
                    notes: "",
                },
            ];

            // Get all images (profile + gallery)
            const allImages: string[] = [];
            if (data.profileImage) {
                allImages.push(data.profileImage);
            }
            if (data.gallery && Array.isArray(data.gallery)) {
                allImages.push(...data.gallery);
            }

            // Extract labels from services (first 5)
            const labels = (data.services || []).slice(0, 5);

            // Create the escort document with the correct Escort interface structure
            const escortData: any = {
                // Basic Info
                id: "", // Will be set by Firestore
                name: data.name,
                username: slug,
                previewPhoto: data.profileImage || data.gallery?.[0] || "",
                labels: labels,
                email: data.email || "",
                age: data.age?.toString() || "",
                telephone: data.phone || data.telephone || "",
                whatsappPhone: data.whatsappPhone || data.phone || "",

                // Media
                images: allImages,
                videos: data.videos || [],

                // About
                about: data.about || "",

                // Availability (array format for easy filtering)
                availability: availabilityArray,

                // Physical Attributes
                ethnicity: Array.isArray(data.ethnicity)
                    ? data.ethnicity[0] || ""
                    : data.ethnicity || "",
                nationality: data.nationality || "",
                bustSize: data.bustSize || "",
                weight: data.weight?.toString() || "",
                zodiacSign: data.zodiacSign || "",
                sexualOrientation: data.sexualOrientation || "",
                gender: data.gender || "female",
                hairColor: data.hairColor || "",
                eyeColor: data.eyeColor || "",
                breastSize: data.breastSize || "",
                height: data.height || 0,

                // Languages & Categories
                languages: data.languages || ["English"],
                categories: data.categories || [],

                // Location
                country: data.country || "Kenya",
                county: data.county || "Nairobi",
                countyCode: data.countyCode || "",
                regions: data.region
                    ? [data.region]
                    : data.regions || ["Nairobi Central"],
                primaryRegion: data.region || data.primaryRegion || "Nairobi Central",
                locations: locations,

                // Source & Practices
                source: isAgencyOwned ? "agency" : "direct",
                practices: data.services || [],
                bdsm: data.bdsm || [],
                massage: data.massage || [],
                extraServices: data.extraServices || [],

                // Slug & Role
                slug: slug,
                role: "escort",

                // Opening Hours
                openingHours: openingHours,

                // Rates/Pricing
                rates: rates,

                // Additional attributes
                ageCategory: data.ageCategory || "",
                character: data.character || "",
                experience: data.experience || "",
                workType: data.workType || "",

                // Status Flags
                isAgencyOwned: isAgencyOwned,
                isAgencyFeatured: false,
                isActive: true,
                isVerified: false,
                isFeatured: false,
                isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,

                // Plan
                plan: {
                    type: isAgencyOwned ? "agency" : "basic",
                    isActive: true,
                    features: [],
                },

                // Stats
                totalBookings: 0,
                totalReviews: 0,
                rating: 0,
                totalViews: 0,

                // Agency Reference
                agencyId: agencyId || null,

                // Verification
                verificationStatus: "pending",

                // Timestamps
                joinedDate: now,
                createdAt: now,
                updatedAt: now,
            };

            // Store the availability object separately if needed for detailed availability
            if (data.availability) {
                escortData.availabilityDetails = data.availability;
            }

            // Store pricing separately if needed
            if (data.pricing) {
                escortData.pricing = data.pricing;
            }

            // Create the document in Firestore
            const docRef = await addDoc(collection(db, "escorts"), escortData);

            // If agency-owned, update agency's employee count
            if (isAgencyOwned && agencyId) {
                const agencyRef = doc(db, "agencies", agencyId);
                await updateDoc(agencyRef, {
                    featuredEmployeesCount: increment(1),
                    updatedAt: now,
                });
            }

            // Return the created escort with its ID
            return {
                id: docRef.id,
                ...escortData,
            } as IEscort;
        } catch (error) {
            console.error("Error creating escort:", error);
            throw error;
        }
    }

    // Get escort by ID
    static async getById(id: string): Promise<IEscort | null> {
        try {
            if (!db) {
                throw new Error("Firebase db not initialized");
            }

            console.log("Getting escort with ID:", id);
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log("Escort found:", data);

                // Increment view count asynchronously (don't await to not block response)
                updateDoc(docRef, {
                    totalViews: increment(1),
                }).catch((err) => console.error("Error incrementing view count:", err));

                return {id: docSnap.id, ...data} as IEscort;
            }

            console.log("Escort not found with ID:", id);
            return null;
        } catch (error) {
            console.error("Error getting escort:", error);
            throw error;
        }
    }

    // Get all escorts with filters
    static async getAll(
        params: GetEscortsParams = {},
    ): Promise<{ escorts: IEscort[]; total: number; hasMore: boolean }> {
        try {
            if (!db) {
                throw new Error("Firebase db not initialized");
            }

            const {
                page = 1,
                limit: limitCount = 20,
                agencyId,
                isAvailable,
                isVerified,
                minAge,
                maxAge,
                services,
                minPrice,
                maxPrice,
                county,
                region,
                town,
                isAgencyOwned,
                sortBy = "createdAt",
                sortOrder = "desc",
            } = params;

            let constraints: any[] = [];

            if (agencyId) {
                constraints.push(where("agencyId", "==", agencyId));
            }

            if (isAvailable !== undefined) {
                constraints.push(where("isAvailable", "==", isAvailable));
            }

            if (isVerified !== undefined) {
                constraints.push(where("isVerified", "==", isVerified));
            }

            if (isAgencyOwned !== undefined) {
                constraints.push(where("isAgencyOwned", "==", isAgencyOwned));
            }

            if (minAge) {
                constraints.push(where("age", ">=", minAge));
            }

            if (maxAge) {
                constraints.push(where("age", "<=", maxAge));
            }

            if (county) {
                constraints.push(where("county", "==", county));
            }

            if (region) {
                constraints.push(where("region", "==", region));
            }

            if (town) {
                constraints.push(where("town", "==", town));
            }

            if (services && services.length > 0) {
                constraints.push(where("services", "array-contains-any", services));
            }

            constraints.push(orderBy(sortBy, sortOrder));
            constraints.push(limit(limitCount));

            const q = query(collection(db, COLLECTION_NAME), ...constraints);
            const querySnapshot = await getDocs(q);

            const escorts = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as IEscort[];

            // Filter by price range (client-side as pricing is nested)
            let filteredEscorts = escorts;
            if (minPrice || maxPrice) {
                filteredEscorts = escorts.filter((escort) => {
                    const price = escort.pricing?.incall?.hour || 0;
                    if (minPrice && price < minPrice) return false;
                    if (maxPrice && price > maxPrice) return false;
                    return true;
                });
            }

            return {
                escorts: filteredEscorts,
                total: filteredEscorts.length,
                hasMore: filteredEscorts.length === limitCount,
            };
        } catch (error) {
            console.error("Error getting escorts:", error);
            throw error;
        }
    }

    // Get escorts by agency
    static async getByAgencyId(
        agencyId: string,
        params: Omit<GetEscortsParams, "agencyId"> = {},
    ): Promise<{ escorts: IEscort[]; total: number; hasMore: boolean }> {
        return this.getAll({...params, agencyId});
    }

    // Update escort
    static async update(id: string, data: UpdateEscortDTO): Promise<void> {
        try {
            if (!db) {
                throw new Error("Firebase db not initialized");
            }

            const docRef = doc(db, COLLECTION_NAME, id);
            const oldData = await getDoc(docRef);

            if (!oldData.exists()) {
                throw new Error("Escort not found");
            }

            const oldEscort = oldData.data();
            const updateData: any = {
                ...data,
                updatedAt: new Date(),
            };

            // Handle agency assignment changes
            if (data.agencyId !== undefined && oldEscort.agencyId !== data.agencyId) {
                // Remove from old agency
                if (oldEscort.agencyId) {
                    const oldAgencyRef = doc(db, "agencies", oldEscort.agencyId);
                    await updateDoc(oldAgencyRef, {
                        featuredEmployeesCount: increment(-1),
                        updatedAt: new Date(),
                    });
                }

                // Add to new agency
                if (data.agencyId) {
                    const newAgencyRef = doc(db, "agencies", data.agencyId);
                    const newAgencyDoc = await getDoc(newAgencyRef);

                    if (!newAgencyDoc.exists()) {
                        throw new Error("New agency not found");
                    }

                    const newAgency = newAgencyDoc.data();
                    if (
                        newAgency.featuredEmployeesCount >= newAgency.plan?.maxEmployees
                    ) {
                        throw new Error(
                            `Maximum employees limit reached for the new agency`,
                        );
                    }

                    await updateDoc(newAgencyRef, {
                        featuredEmployeesCount: increment(1),
                        updatedAt: new Date(),
                    });

                    updateData.isAgencyOwned = true;
                } else {
                    updateData.isAgencyOwned = false;
                }
            }

            await updateDoc(docRef, updateData);
        } catch (error) {
            console.error("Error updating escort:", error);
            throw error;
        }
    }

    // Delete escort
    static async delete(id: string): Promise<void> {
        try {
            if (!db) {
                throw new Error("Firebase db not initialized");
            }

            const escortDoc = await getDoc(doc(db, COLLECTION_NAME, id));

            if (!escortDoc.exists()) {
                throw new Error("Escort not found");
            }

            const escort = escortDoc.data();

            // If agency-owned, decrease agency's employee count
            if (escort.isAgencyOwned && escort.agencyId) {
                const agencyRef = doc(db, "agencies", escort.agencyId);
                await updateDoc(agencyRef, {
                    featuredEmployeesCount: increment(-1),
                    updatedAt: new Date(),
                });
            }

            // Delete the escort document
            await deleteDoc(doc(db, COLLECTION_NAME, id));
        } catch (error) {
            console.error("Error deleting escort:", error);
            throw error;
        }
    }

    // Upload gallery images for an escort
    static async uploadGallery(
        escortId: string,
        files: any[],
        agencyId?: string,
    ): Promise<string[]> {
        try {
            if (!db) {
                throw new Error("Firebase db not initialized");
            }

            const uploadedUrls: string[] = [];
            const escortRef = doc(db, COLLECTION_NAME, escortId);
            const escortDoc = await getDoc(escortRef);

            if (!escortDoc.exists()) {
                throw new Error("Escort not found");
            }

            const escort = escortDoc.data();
            const currentGallery = Array.isArray(escort.gallery)
                ? escort.gallery
                : [];

            // Import storage here to avoid circular dependencies
            const {storage} = await import("@/lib/firebase");
            const {ref, uploadBytes, getDownloadURL} = await import(
                "firebase/storage"
                );

            for (const file of files) {
                const extension = file.name.split(".").pop() || "jpg";
                const fileName = `escort_${escortId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${extension}`;
                const storagePath = agencyId
                    ? `agencies/${agencyId}/escorts/${escortId}/gallery/${fileName}`
                    : `escorts/${escortId}/gallery/${fileName}`;

                const storageRef = ref(storage, storagePath);
                const buffer = Buffer.from(await file.arrayBuffer());
                await uploadBytes(storageRef, buffer, {contentType: file.type});
                const downloadUrl = await getDownloadURL(storageRef);
                uploadedUrls.push(downloadUrl);
            }

            await updateDoc(escortRef, {
                gallery: [...currentGallery, ...uploadedUrls],
                updatedAt: new Date(),
            });

            return uploadedUrls;
        } catch (error) {
            console.error("Error uploading gallery:", error);
            throw error;
        }
    }
}
