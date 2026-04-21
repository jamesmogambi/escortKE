// app/api/firebase/migrate-images/resume/route.ts
import { NextResponse } from "next/server";
import { migrationQueue } from "@/lib/migration.queue";

export async function POST() {
  const result = await migrationQueue.resumeMigration();
  return NextResponse.json(result);
}
