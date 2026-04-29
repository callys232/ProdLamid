import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Wallet } from "@/lib/models/Wallet";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(req.url);
    const page  = Math.max(1, Number(searchParams.get("page")  ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const skip  = (page - 1) * limit;

    const wallet = await Wallet.findOne({ user: auth.userId }).lean() as any;
    if (!wallet) return NextResponse.json({ success: false, message: "Wallet not found" }, { status: 404 });

    const all    = wallet.transactions ?? [];
    const sorted = [...all].sort((a: any, b: any) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
    const paged  = sorted.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      data: paged,
      balance: wallet.balance,
      pagination: { page, limit, total: all.length, pages: Math.ceil(all.length / limit) },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
