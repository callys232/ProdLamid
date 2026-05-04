import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Users } from "@/lib/models/User";

export const dynamic = "force-dynamic";

// GET /api/admin/kyc — list users with pending KYC
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (auth.userRole !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") ?? "pending";
    const page   = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit  = 20;

    const [users, total] = await Promise.all([
      Users.find({ kycStatus: status })
        .select("username email kycStatus kycDocuments createdAt")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Users.countDocuments({ kycStatus: status }),
    ]);

    return NextResponse.json({ success: true, data: users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// PATCH /api/admin/kyc — approve or reject a user's KYC
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (auth.userRole !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { userId, status } = await req.json();
    if (!userId || !["approved", "rejected"].includes(status))
      return NextResponse.json({ error: "userId and status (approved|rejected) required" }, { status: 400 });

    await Users.findByIdAndUpdate(userId, { $set: { kycStatus: status } });
    return NextResponse.json({ success: true, message: `KYC ${status}` });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
