// ⚠️ DEV ONLY — run once then delete
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Users } from "@/lib/models/User";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ message: "Not available in production." }, { status: 403 });
  }
  await dbConnect();

  // Backfill accountType for enterprise users (have orgId but no accountType)
  const result = await Users.updateMany(
    { orgId: { $ne: null }, accountType: { $exists: false } },
    { $set: { accountType: "Enterprise" } }
  );

  return NextResponse.json({
    message: `Fixed ${result.modifiedCount} enterprise user(s).`,
    matched: result.matchedCount,
    modified: result.modifiedCount,
  });
}
