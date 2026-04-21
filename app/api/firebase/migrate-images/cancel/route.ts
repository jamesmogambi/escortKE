// app/api/firebase/migrate-images/cancel/route.ts
import { NextResponse } from "next/server";
import { migrationQueue } from "@/lib/migration.queue";

export async function POST() {
  const result = await migrationQueue.cancelMigration();
  return NextResponse.json(result);
}
