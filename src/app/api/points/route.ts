import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { getBalance, getHistory, POINT_COSTS, POINT_PACKAGES } from "@/lib/services/pointsService";

export const dynamic = "force-dynamic";

// GET /api/points — balance, history, costs, packages
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(req.url);
    const page  = Math.max(1, Number(searchParams.get("page")  ?? 1));
    const limit = Math.min(50, Number(searchParams.get("limit") ?? 20));

    const { transactions, balance, pagination } = await getHistory(auth.userId, page, limit);

    return NextResponse.json({
      success: true,
      data: {
        balance,
        transactions,
        pagination,
        costs:    POINT_COSTS,
        packages: POINT_PACKAGES,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
