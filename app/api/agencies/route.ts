// app/api/agencies/route.ts (Create and List)
import { NextRequest, NextResponse } from "next/server";
import AgencyService from "@/lib/services/agency.service";

// GET - List agencies
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const county = searchParams.get("county") || undefined;
    const region = searchParams.get("region") || undefined;
    const town = searchParams.get("town") || undefined;
    const businessType = searchParams.get("businessType") || undefined;
    const isVerified =
      searchParams.get("isVerified") === "true"
        ? true
        : searchParams.get("isVerified") === "false"
          ? false
          : undefined;
    const isFeatured =
      searchParams.get("isFeatured") === "true"
        ? true
        : searchParams.get("isFeatured") === "false"
          ? false
          : undefined;
    const search = searchParams.get("search") || undefined;

    const result = await AgencyService.getAgencies({
      page,
      limit,
      county,
      region,
      town,
      businessType,
      isVerified,
      isFeatured,
      search,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error fetching agencies:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// POST - Create agency
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "description",
      "contactEmail",
      "contactPhone",
      "ownerId",
      "county",
      "region",
      "town",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    const agency = await AgencyService.createAgency(body);

    return NextResponse.json({
      success: true,
      data: agency,
      message: "Agency created successfully",
    });
  } catch (error: any) {
    console.error("Error creating agency:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
