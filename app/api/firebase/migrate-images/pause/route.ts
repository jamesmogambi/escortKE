// app/api/firebase/migrate-images/pause/route.ts
import { NextResponse } from "next/server";
import { migrationQueue } from "@/lib/migration.queue";

export async function POST() {
  const result = await migrationQueue.pauseMigration();
  return NextResponse.json(result);
}
