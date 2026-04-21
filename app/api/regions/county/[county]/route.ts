// app/api/regions/county/[county]/route.ts
import { NextRequest, NextResponse } from "next/server";
import RegionService from "@/lib/services/region.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { county: string } },
) {
  try {
    const { county } = params;
    const searchParams = request.nextUrl.searchParams;
    const isActive = searchParams.get("isActive") !== "false";
    const decodedCounty = decodeURIComponent(county);

    console.log(`Fetching regions for county: ${decodedCounty}`);

    // Get all regions for this county
    let regions = await RegionService.getRegionsByCounty(decodedCounty);

    // Filter by active status if needed
    if (isActive !== undefined) {
      regions = regions.filter((r) => r.isActive === isActive);
    }

    return NextResponse.json({
      success: true,
      data: regions,
      total: regions.length,
      county: decodedCounty,
    });
  } catch (error: any) {
    console.error("Error fetching regions by county:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
