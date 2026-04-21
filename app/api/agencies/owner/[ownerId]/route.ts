// app/api/agencies/owner/[ownerId]/route.ts (Get by owner)
import { NextRequest, NextResponse } from "next/server";
import AgencyService from "@/lib/services/agency.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { ownerId: string } },
) {
  try {
    const { ownerId } = await params;
    const agencies = await AgencyService.getAgenciesByOwner(ownerId);

    return NextResponse.json({
      success: true,
      data: agencies,
    });
  } catch (error: any) {
    console.error("Error fetching agencies by owner:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
