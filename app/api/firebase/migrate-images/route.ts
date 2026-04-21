// app/api/firebase/migrate-images/route.ts
import { NextRequest, NextResponse } from "next/server";
import { migrationQueue } from "@/lib/migration.queue";

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action");

  switch (action) {
    case "start":
      const body = await request.json();
      const result = await migrationQueue.startMigration(body);
      return NextResponse.json(result);

    case "pause":
      const pauseResult = await migrationQueue.pauseMigration();
      return NextResponse.json(pauseResult);

    case "resume":
      const resumeResult = await migrationQueue.resumeMigration();
      return NextResponse.json(resumeResult);

    case "cancel":
      const cancelResult = await migrationQueue.cancelMigration();
      return NextResponse.json(cancelResult);

    case "reset":
      const resetResult = await migrationQueue.resetAllMigrationFlags();
      return NextResponse.json(resetResult);

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action");

  if (action === "status") {
    const status = migrationQueue.getJobStatus();
    return NextResponse.json(status);
  }

  if (action === "debug") {
    // Your debug logic here
    return NextResponse.json({ message: "Debug endpoint" });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

// # Start migration
// curl -X POST "http://localhost:3000/api/firebase/migrate-images?action=start" \
//   -H "Content-Type: application/json" \
//   -d '{"batchSize": 5}'

// # Check status
// curl "http://localhost:3000/api/firebase/migrate-images?action=status"

// # Pause
// curl -X POST "http://localhost:3000/api/firebase/migrate-images?action=pause"

// # Resume
// curl -X POST "http://localhost:3000/api/firebase/migrate-images?action=resume"
