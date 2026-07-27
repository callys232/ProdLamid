import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Escrow } from "@/lib/models/Escrow";
import { Wallet } from "@/lib/models/Wallet";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (auth.userRole !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [
      totalEscrows, fundedEscrows, releasedEscrows,
      walletCount,
    ] = await Promise.all([
      Escrow.countDocuments(),
      Escrow.countDocuments({ status: "funded" }),
      Escrow.countDocuments({ status: "released" }),
      Wallet.countDocuments(),
    ]);

    /* One pass over every status rather than a query per bucket. The previous
       version only asked about "funded" and "released", so escrows sitting in
       dispute, refunded or canceled appeared in no figure at all — money could
       be held indefinitely and show up nowhere on this panel. */
    const byStatusAgg = await Escrow.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 }, total: { $sum: "$amount" } } },
    ]);
    const byStatus: Record<string, { count: number; total: number }> = {};
    for (const row of byStatusAgg) {
      byStatus[row._id ?? "unknown"] = { count: row.count, total: row.total ?? 0 };
    }
    const bucket = (k: string) => byStatus[k] ?? { count: 0, total: 0 };

    const totalFundedValue   = bucket("funded").total;
    const totalReleasedValue = bucket("released").total;
    const disputed = bucket("disputed");
    const refunded = bucket("refunded");

    return NextResponse.json({
      success: true,
      data: {
        escrows: {
          total:    totalEscrows,
          funded:   fundedEscrows,
          released: releasedEscrows,
          disputed: disputed.count,
          refunded: refunded.count,
        },
        value: {
          funded:   totalFundedValue,
          released: totalReleasedValue,
          disputed: disputed.total,
          refunded: refunded.total,
          /* Money taken from a client and neither released nor returned. */
          held:     totalFundedValue + disputed.total,
        },
        byStatus,
        wallets: walletCount,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
