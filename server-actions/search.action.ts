"use server";

import {adminDb} from "@/lib/firebase-admin";
import {convertQueryDocToEscort, Escort} from "./escort.action";

interface SearchEscortsOptions {
    query: string;
    limit?: number;
    page?: number;
    filters?: {
        county?: string;
        region?: string;
        gender?: string;
    };
}

export async function searchEscorts({
                                        query,
                                        limit = 20,
                                        page = 1,
                                        filters = {},
                                    }: SearchEscortsOptions) {
    try {
        const validPage = Math.max(1, page);
        const validLimit = Math.max(1, limit);
        const searchTerm = query.trim().toLowerCase();

        // Start with a basic query
        let firestoreQuery: any = adminDb.collection("escorts").where("isActive", "==", true);

        // Apply basic filters that Firestore handles well
        // Gender filter
        if (filters.gender && filters.gender !== "all") {
            firestoreQuery = firestoreQuery.where("gender", "==", filters.gender);
        }

        // County filter - if it looks like an ID or a standard code
        if (filters.county && filters.county !== "all" && /^[0-9]+$/.test(filters.county)) {
            firestoreQuery = firestoreQuery.where("county", "==", filters.county);
        }

        // Optimization: Apply common text filters before full in-memory scan if query is provided
        // This is a placeholder for potential Firestore prefix searching if needed later.

        const snapshot = await firestoreQuery.get();
        let allEscorts: Escort[] = await Promise.all(snapshot.docs.map(convertQueryDocToEscort));

        // Manual filtering for the search query across multiple fields
        if (searchTerm) {
            allEscorts = allEscorts.filter((escort) => {
                const nameMatch = escort.name?.toLowerCase().includes(searchTerm);
                const usernameMatch = escort.username?.toLowerCase().includes(searchTerm);
                const aboutMatch = escort.about?.toLowerCase().includes(searchTerm);
                const townMatch = (escort.locations || []).some(loc => loc.town?.toLowerCase().includes(searchTerm));
                const estateMatch = (escort.locations || []).some(loc => loc.estate?.toLowerCase().includes(searchTerm));
                const practiceMatch = (escort.practices || []).some(p => p.toLowerCase().includes(searchTerm));
                const categoryMatch = (escort.categories || []).some(c => c.toLowerCase().includes(searchTerm));

                return nameMatch || usernameMatch || aboutMatch || townMatch || estateMatch || practiceMatch || categoryMatch;
            });
        }

        // Apply additional filters in-memory if not already applied by Firestore
        if (filters.county && filters.county !== "all") {
            const countyLower = filters.county.toLowerCase();
            allEscorts = allEscorts.filter(escort =>
                escort.county?.toLowerCase() === countyLower ||
                escort.countyCode?.toLowerCase() === countyLower
            );
        }

        if (filters.region && filters.region !== "all") {
            const regionLower = filters.region.toLowerCase();
            allEscorts = allEscorts.filter(escort =>
                escort.primaryRegion?.toLowerCase() === regionLower ||
                (escort.regions || []).some(r => r.toLowerCase() === regionLower)
            );
        }

        const total = allEscorts.length;
        const totalPages = Math.ceil(total / validLimit);
        const skip = (validPage - 1) * validLimit;
        const paginatedEscorts = allEscorts.slice(skip, skip + validLimit);

        return {
            success: true,
            data: {
                escorts: JSON.parse(JSON.stringify(paginatedEscorts)),
                pagination: {
                    page: validPage,
                    limit: validLimit,
                    total,
                    totalPages,
                    hasNextPage: validPage < totalPages,
                    hasPreviousPage: validPage > 1,
                },
            },
        };
    } catch (error) {
        console.error("Search error:", error);
        return {
            success: false,
            error: "Failed to search escorts",
        };
    }
}
