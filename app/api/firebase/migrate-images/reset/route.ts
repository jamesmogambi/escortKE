// app/api/firebase/migrate-images/reset/route.ts
import { NextResponse } from "next/server";
import { migrationQueue } from "@/lib/migration.queue";

export async function POST() {
  const result = await migrationQueue.resetAllMigrationFlags();
  return NextResponse.json(result);
}
