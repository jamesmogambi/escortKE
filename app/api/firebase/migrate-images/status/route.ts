// app/api/firebase/migrate-images/status/route.ts
import { NextResponse } from "next/server";
import { migrationQueue } from "@/lib/migration.queue";

export async function GET() {
  const status = migrationQueue.getJobStatus();
  return NextResponse.json(status);
}
