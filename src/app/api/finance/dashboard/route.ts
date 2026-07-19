import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { FinanceDashboard } from "@/lib/models/FinanceDashboard";

export const dynamic = "force-dynamic";

const DEFAULTS = {
  revenueHealth:   0,
  marginScore:     0,
  cashFlowClarity: 0,
  enterpriseValue: 0,
  financialSignals: [] as { severity: "High" | "Medium" | "Low"; title: string; action: string }[],
  budgetProgress: [] as { label: string; value: number }[],
};

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const doc = await FinanceDashboard.findOne({ userId: auth.userId }).lean() as any;

    if (!doc) {
      return NextResponse.json({ success: true, data: DEFAULTS, seeded: false });
    }

    return NextResponse.json({
      success: true,
      data: {
        revenueHealth:    doc.revenueHealth,
        marginScore:      doc.marginScore,
        cashFlowClarity:  doc.cashFlowClarity,
        enterpriseValue:  doc.enterpriseValue,
        financialSignals: doc.financialSignals ?? [],
        budgetProgress:   doc.budgetProgress   ?? [],
      },
      seeded: true,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// PATCH — upsert KPI data (for admin seeding, integrations, future AI writes)
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();

    const allowed = [
      "revenueHealth",
      "marginScore",
      "cashFlowClarity",
      "enterpriseValue",
      "financialSignals",
      "budgetProgress",
    ];

    const update: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ success: false, error: "No valid fields provided" }, { status: 400 });
    }

    const doc = await FinanceDashboard.findOneAndUpdate(
      { userId: auth.userId },
      { $set: { ...update, orgId: auth.orgId ?? null } },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({ success: true, data: doc });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
