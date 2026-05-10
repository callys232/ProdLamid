import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Organization } from "@/lib/models/Organization";
import { EscrowTransaction } from "@/lib/models/EscrowTransaction";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (!auth.orgId) return NextResponse.json({ error: "No enterprise org" }, { status: 403 });

    const org = await Organization.findById(auth.orgId).lean() as any;
    if (!org) return NextResponse.json({ error: "Org not found" }, { status: 404 });

    // Use EscrowTransactions as a proxy for invoice history until a dedicated billing model exists
    const transactions = await EscrowTransaction.find({ orgId: auth.orgId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean() as any[];

    // Shape them into invoice-like records
    const invoices = transactions.map((t: any, i: number) => ({
      id:     `INV-${String(1000 + i).padStart(4, "0")}`,
      date:   t.createdAt ?? t.date,
      amount: t.amount ?? 0,
      status: t.status === "released" ? "paid" : t.status === "failed" ? "failed" : "pending",
      cycle:  org.billingCycle ?? "monthly",
    }));

    return NextResponse.json({
      success: true,
      invoices,
      org: {
        tier:          org.tier,
        billingCycle:  org.billingCycle,
        status:        org.status,
        stripeCustomerId: org.stripeCustomerId,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
