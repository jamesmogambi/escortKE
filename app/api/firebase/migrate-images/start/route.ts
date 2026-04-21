// app/api/firebase/migrate-images/start/route.ts
import { NextRequest, NextResponse } from "next/server";
import { migrationQueue } from "@/lib/migration.queue";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { batchSize = 5, delay = 2000, imageDelay = 500, maxEscorts } = body;

    const result = await migrationQueue.startMigration({
      batchSize,
      delay,
      imageDelay,
      maxEscorts,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// GET endpoint for quick start
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const batchSize = parseInt(searchParams.get("batchSize") || "5");
  const maxEscorts = parseInt(searchParams.get("maxEscorts") || "0");

  const result = await migrationQueue.startMigration({
    batchSize,
    maxEscorts: maxEscorts || undefined,
  });

  return NextResponse.json(result);
}
