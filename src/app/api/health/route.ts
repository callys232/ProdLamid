import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();

  let dbStatus = "disconnected";
  try {
    await connectDB();
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    dbStatus = states[mongoose.connection.readyState] ?? "unknown";
  } catch {
    dbStatus = "error";
  }

  const healthy = dbStatus === "connected";

  return NextResponse.json(
    {
      status:  healthy ? "ok" : "degraded",
      version: process.env.npm_package_version ?? "1.0.0",
      uptime:  Math.floor(process.uptime()),
      latencyMs: Date.now() - start,
      services: { database: dbStatus, api: "ok" },
      env:     process.env.NODE_ENV,
      ts:      new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 }
  );
}
