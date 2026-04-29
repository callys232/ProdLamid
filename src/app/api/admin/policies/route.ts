import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";

export const dynamic = "force-dynamic";

// Platform policies stored as a simple config document.
// Extend with a Policy model when requirements grow.
const DEFAULT_POLICIES = {
  maxProjectBudget:        500000,
  minProjectBudget:        100,
  escrowHoldDays:          3,
  disputeWindowDays:       7,
  platformFeePercent:      5,
  maxBidsPerProject:       30,
  consultantVettingEnabled: true,
  autoApproveVerified:     false,
};

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (auth.userRole !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json({ success: true, data: DEFAULT_POLICIES });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (auth.userRole !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const updates = await req.json();
    // In production: persist to DB. For now return merged object.
    const merged = { ...DEFAULT_POLICIES, ...updates };
    return NextResponse.json({ success: true, data: merged });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
