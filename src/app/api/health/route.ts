import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbState = ["disconnected", "connected", "connecting", "disconnecting"];
  const db      = dbState[mongoose.connection.readyState] ?? "unknown";

  const status = db === "connected" ? "ok" : "degraded";

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      services:  { database: db, api: "ok" },
      version:   process.env.npm_package_version ?? "1.0.0",
    },
    { status: status === "ok" ? 200 : 503 }
  );
}
