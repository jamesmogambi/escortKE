import {MetadataRoute} from "next";
import {getAllCounties, getAllRegions} from "../actions/region.action";

import {fetchGirlEscorts} from "../actions/list-escort";
import {EscortCardData} from "../types/escort.types";
import {getBDSMTypes, getMassageTypes, getPractices,} from "@/actions/variantsetting.action";

// const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kenyadivas.com";
// Use port 4000 for local development
const baseUrl =
    process.env.NODE_ENV === "development"
        ? "http://localhost:4000"
        : process.env.NEXT_PUBLIC_SITE_URL || "https://kenyadivas.com";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    console.log("\n🔴 ========== SITEMAP GENERATION STARTED ==========");
    console.log("🕐 Timestamp:", new Date().toISOString());
    console.log("🌐 Base URL:", baseUrl);

    try {
        // ===== FETCHING DATA =====
        console.log("\n📡 STEP 1: Fetching data from all sources...");

        console.log("⏳ Fetching counties...");
        const countiesStart = Date.now();
        const counties = await getAllCounties();
        const countiesTime = Date.now() - countiesStart;
        console.log(`✅ Counties fetched in ${countiesTime}ms`);
        console.log(`   - Counties count: ${counties?.data?.length || 0}`);
        if (counties?.data?.length > 0) {
            console.log(
                "   - First 3 counties:",
                counties.data.slice(0, 3).map((c: any) => c.name),
            );
        }

        console.log("\n⏳ Fetching regions...");
        const regionsStart = Date.now();
        const regions = await getAllRegions();
        const regionsTime = Date.now() - regionsStart;
        console.log(`✅ Regions fetched in ${regionsTime}ms`);
        console.log(`   - Regions count: ${regions?.data?.length || 0}`);
        if (regions?.data?.length > 0) {
            console.log(
                "   - First 3 regions:",
                regions.data.slice(0, 3).map((r: any) => r.name),
            );
        }

        console.log("\n⏳ Fetching practices...");
        const practicesStart = Date.now();
        const practices = await getPractices();
        const practicesTime = Date.now() - practicesStart;
        console.log(`✅ Practices fetched in ${practicesTime}ms`);
        console.log(`   - Practices count: ${practices.length}`);
        if (practices.length > 0) {
            console.log(
                "   - All practices:",
                practices.map((p: any) => p.name),
            );
        } else {
            console.warn("   ⚠️ No practices found!");
        }

        console.log("\n⏳ Fetching massage types...");
        const massageStart = Date.now();
        const massageTypes = await getMassageTypes();
        const massageTime = Date.now() - massageStart;
        console.log(`✅ Massage types fetched in ${massageTime}ms`);
        console.log(`   - Massage types count: ${massageTypes.length}`);
        if (massageTypes.length > 0) {
            console.log(
                "   - All massage types:",
                massageTypes.map((m: any) => m.name),
            );
        }

        console.log("\n⏳ Fetching BDSM types...");
        const bdsmStart = Date.now();
        const bdsmTypes = await getBDSMTypes();
        const bdsmTime = Date.now() - bdsmStart;
        console.log(`✅ BDSM types fetched in ${bdsmTime}ms`);
        console.log(`   - BDSM types count: ${bdsmTypes.length}`);
        if (bdsmTypes.length > 0) {
            console.log(
                "   - All BDSM types:",
                bdsmTypes.map((b: any) => b.name),
            );
        }

        console.log("\n⏳ Fetching escorts...");
        const escortsStart = Date.now();
        const escortsRes = await fetchGirlEscorts({limit: 1000});
        const escortsTime = Date.now() - escortsStart;
        console.log(`✅ Escorts fetched in ${escortsTime}ms`);
        console.log(`   - Escorts count: ${escortsRes?.escorts?.length || 0}`);
        if (escortsRes?.escorts?.length > 0) {
            console.log(
                "   - First 3 escort slugs:",
                escortsRes.escorts.slice(0, 3).map((e: any) => e.slug),
            );
        }

        // ===== GENERATING STATIC PAGES =====
        console.log("\n📝 STEP 2: Generating static pages...");
        const staticPages = [
            {
                url: `${baseUrl}`,
                lastModified: new Date(),
                changeFrequency: "daily" as const,
                priority: 1.0,
            },
            {
                url: `${baseUrl}/about`,
                lastModified: new Date(),
                changeFrequency: "monthly" as const,
                priority: 0.5,
            },
            {
                url: `${baseUrl}/contact`,
                lastModified: new Date(),
                changeFrequency: "monthly" as const,
                priority: 0.5,
            },
            {
                url: `${baseUrl}/terms`,
                lastModified: new Date(),
                changeFrequency: "yearly" as const,
                priority: 0.3,
            },
            {
                url: `${baseUrl}/privacy`,
                lastModified: new Date(),
                changeFrequency: "yearly" as const,
                priority: 0.3,
            },
            {
                url: `${baseUrl}/safety-tips`,
                lastModified: new Date(),
                changeFrequency: "monthly" as const,
                priority: 0.6,
            },
            {
                url: `${baseUrl}/blog`,
                lastModified: new Date(),
                changeFrequency: "weekly" as const,
                priority: 0.7,
            },
        ];
        console.log(`✅ Static pages generated: ${staticPages.length}`);

        // ===== GENERATING DYNAMIC URLS =====
        console.log("\n🔗 STEP 3: Generating dynamic URLs...");

        // County URLs
        console.log("\n⏳ Generating county URLs...");
        const countyUrls =
            counties?.data?.map((county: any) => {
                const url = `${baseUrl}/girls?county=${encodeURIComponent(county.name)}`;
                console.log(`   - Adding: ${url}`);
                return {
                    url,
                    lastModified: new Date(),
                    changeFrequency: "daily" as const,
                    priority: 0.9,
                };
            }) || [];
        console.log(`✅ County URLs generated: ${countyUrls.length}`);

        // Region URLs
        console.log("\n⏳ Generating region URLs...");
        const regionUrls =
            regions?.data?.map((region: any) => {
                const url = `${baseUrl}/girls?region=${encodeURIComponent(region.name)}`;
                console.log(`   - Adding: ${url}`);
                return {
                    url,
                    lastModified: new Date(),
                    changeFrequency: "daily" as const,
                    priority: 0.9,
                };
            }) || [];
        console.log(`✅ Region URLs generated: ${regionUrls.length}`);

        // Practice URLs
        console.log("\n⏳ Generating practice URLs...");
        const practiceUrls = practices.map((practice: any) => {
            const url = `${baseUrl}/girls?practice=${encodeURIComponent(practice.name)}`;
            console.log(`   - Adding: ${url}`);
            return {
                url,
                lastModified: new Date(),
                changeFrequency: "daily" as const,
                priority: 0.9,
            };
        });
        console.log(`✅ Practice URLs generated: ${practiceUrls.length}`);

        // Massage URLs
        console.log("\n⏳ Generating erotic massage URLs...");
        const eroticMassageUrls = massageTypes.map((massage: any) => {
            const url = `${baseUrl}/erotic-massages?massageType=${encodeURIComponent(massage.name)}`;
            console.log(`   - Adding: ${url}`);
            return {
                url,
                lastModified: new Date(),
                changeFrequency: "daily" as const,
                priority: 0.9,
            };
        });
        console.log(
            `✅ Erotic massage URLs generated: ${eroticMassageUrls.length}`,
        );

        // County Massage URLs
        console.log("\n⏳ Generating county massage URLs...");
        const countyMassageUrls =
            counties?.data?.map((county: any) => {
                const url = `${baseUrl}/erotic-massages?county=${encodeURIComponent(county.name)}`;
                console.log(`   - Adding: ${url}`);
                return {
                    url,
                    lastModified: new Date(),
                    changeFrequency: "daily" as const,
                    priority: 0.9,
                };
            }) || [];
        console.log(
            `✅ County massage URLs generated: ${countyMassageUrls.length}`,
        );

        // Region Massage URLs
        console.log("\n⏳ Generating region massage URLs...");
        const regionsMassageUrls =
            regions?.data?.map((region: any) => {
                const url = `${baseUrl}/erotic-massages?region=${encodeURIComponent(region.name)}`;
                console.log(`   - Adding: ${url}`);
                return {
                    url,
                    lastModified: new Date(),
                    changeFrequency: "daily" as const,
                    priority: 0.9,
                };
            }) || [];
        console.log(
            `✅ Region massage URLs generated: ${regionsMassageUrls.length}`,
        );

        // Agency URLs by region
        console.log("\n⏳ Generating agency by region URLs...");
        const regionAgencies =
            regions?.data?.map((region: any) => {
                const url = `${baseUrl}/agencies?region=${encodeURIComponent(region.name)}`;
                console.log(`   - Adding: ${url}`);
                return {
                    url,
                    lastModified: new Date(),
                    changeFrequency: "daily" as const,
                    priority: 0.9,
                };
            }) || [];
        console.log(`✅ Agency region URLs generated: ${regionAgencies.length}`);

        // Agency URLs by county
        console.log("\n⏳ Generating agency by county URLs...");
        const countiesAgencies =
            counties?.data?.map((county: any) => {
                const url = `${baseUrl}/agencies?county=${encodeURIComponent(county.name)}`;
                console.log(`   - Adding: ${url}`);
                return {
                    url,
                    lastModified: new Date(),
                    changeFrequency: "daily" as const,
                    priority: 0.9,
                };
            }) || [];
        console.log(`✅ Agency county URLs generated: ${countiesAgencies.length}`);

        // BDSM by county
        console.log("\n⏳ Generating BDSM by county URLs...");
        const countiesBDSM =
            counties?.data?.map((county: any) => {
                const url = `${baseUrl}/bdsm?county=${encodeURIComponent(county.name)}`;
                console.log(`   - Adding: ${url}`);
                return {
                    url,
                    lastModified: new Date(),
                    changeFrequency: "daily" as const,
                    priority: 0.9,
                };
            }) || [];
        console.log(`✅ BDSM county URLs generated: ${countiesBDSM.length}`);

        // BDSM by region
        console.log("\n⏳ Generating BDSM by region URLs...");
        const regionBDSM =
            regions?.data?.map((region: any) => {
                const url = `${baseUrl}/bdsm?region=${encodeURIComponent(region.name)}`;
                console.log(`   - Adding: ${url}`);
                return {
                    url,
                    lastModified: new Date(),
                    changeFrequency: "daily" as const,
                    priority: 0.9,
                };
            }) || [];
        console.log(`✅ BDSM region URLs generated: ${regionBDSM.length}`);

        // BDSM practice URLs
        console.log("\n⏳ Generating BDSM practice URLs...");
        const bdsmPracticeUrls = bdsmTypes.map((type: any) => {
            const url = `${baseUrl}/bdsm?type=${encodeURIComponent(type.name)}`;
            console.log(`   - Adding: ${url}`);
            return {
                url,
                lastModified: new Date(),
                changeFrequency: "daily" as const,
                priority: 0.9,
            };
        });
        console.log(`✅ BDSM practice URLs generated: ${bdsmPracticeUrls.length}`);

        // Profile URLs
        console.log("\n⏳ Generating profile URLs...");
        const profileUrls =
            escortsRes?.escorts?.map((escort: EscortCardData) => {
                const url = `${baseUrl}/girl/${encodeURIComponent(escort.slug)}`;
                console.log(`   - Adding: ${url}`);
                return {
                    url,
                    lastModified: escort.updatedAt || new Date(),
                    changeFrequency: "weekly" as const,
                    priority: 0.8,
                };
            }) || [];
        console.log(`✅ Profile URLs generated: ${profileUrls.length}`);

        // ===== FINAL SUMMARY =====
        const allUrls = [
            ...staticPages,
            ...countyUrls,
            ...regionUrls,
            ...practiceUrls,
            ...eroticMassageUrls,
            ...countyMassageUrls,
            ...regionsMassageUrls,
            ...regionAgencies,
            ...countiesAgencies,
            ...countiesBDSM,
            ...regionBDSM,
            ...bdsmPracticeUrls,
            ...profileUrls,
        ];

        console.log("\n📊 ========== SITEMAP GENERATION SUMMARY ==========");
        console.log("Total URLs generated:", allUrls.length);
        console.log("\nBreakdown by type:");
        console.log(`   - Static pages: ${staticPages.length}`);
        console.log(`   - County URLs: ${countyUrls.length}`);
        console.log(`   - Region URLs: ${regionUrls.length}`);
        console.log(`   - Practice URLs: ${practiceUrls.length}`);
        console.log(`   - Massage URLs: ${eroticMassageUrls.length}`);
        console.log(`   - County Massage URLs: ${countyMassageUrls.length}`);
        console.log(`   - Region Massage URLs: ${regionsMassageUrls.length}`);
        console.log(`   - Agency by Region URLs: ${regionAgencies.length}`);
        console.log(`   - Agency by County URLs: ${countiesAgencies.length}`);
        console.log(`   - BDSM by County URLs: ${countiesBDSM.length}`);
        console.log(`   - BDSM by Region URLs: ${regionBDSM.length}`);
        console.log(`   - BDSM Practice URLs: ${bdsmPracticeUrls.length}`);
        console.log(`   - Profile URLs: ${profileUrls.length}`);

        // Check for empty arrays
        const emptySections = [];
        if (countyUrls.length === 0) emptySections.push("County URLs");
        if (regionUrls.length === 0) emptySections.push("Region URLs");
        if (practiceUrls.length === 0) emptySections.push("Practice URLs");
        if (eroticMassageUrls.length === 0) emptySections.push("Massage URLs");
        if (profileUrls.length === 0) emptySections.push("Profile URLs");

        if (emptySections.length > 0) {
            console.warn("\n⚠️ WARNING: The following sections are empty:");
            emptySections.forEach((section) => console.warn(`   - ${section}`));
        }

        console.log("\n✅ Sitemap generation completed successfully!");
        console.log("🔴 ========== SITEMAP GENERATION ENDED ==========\n");

        return allUrls;
    } catch (error) {
        console.error("\n❌ ERROR in sitemap generation:");
        console.error(error);
        console.log("\n🔴 ========== SITEMAP GENERATION FAILED ==========\n");

        // Fallback to essential URLs
        return [
            {
                url: `${baseUrl}`,
                lastModified: new Date(),
                changeFrequency: "daily" as const,
                priority: 1.0,
            },
        ];
    }
}
