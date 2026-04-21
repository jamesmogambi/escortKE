// app/api/agencies/slug/[slug]/route.ts (Get by slug)
import { NextRequest, NextResponse } from "next/server";
import AgencyService from "@/lib/services/agency.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = await params;
    const agency = await AgencyService.getAgencyBySlug(slug);

    if (!agency) {
      return NextResponse.json(
        { success: false, error: "Agency not found" },
        { status: 404 },
      );
    }

    // Increment view count
    AgencyService.incrementViewCount(agency.id).catch(console.error);

    return NextResponse.json({
      success: true,
      data: agency,
    });
  } catch (error: any) {
    console.error("Error fetching agency by slug:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
