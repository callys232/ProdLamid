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

    // Total value in funded escrows
    const fundedAgg = await Escrow.aggregate([
      { $match: { status: "funded" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalFundedValue = fundedAgg[0]?.total ?? 0;

    // Total released
    const releasedAgg = await Escrow.aggregate([
      { $match: { status: "released" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalReleasedValue = releasedAgg[0]?.total ?? 0;

    return NextResponse.json({
      success: true,
      data: {
        escrows: { total: totalEscrows, funded: fundedEscrows, released: releasedEscrows },
        value:   { funded: totalFundedValue, released: totalReleasedValue },
        wallets: walletCount,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
