import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Users } from "@/lib/models/User";

// POST /api/auth/2fa/verify — confirms OTP and activates 2FA
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { code } = await req.json();
    if (!code) return NextResponse.json({ success: false, message: "Code required" }, { status: 400 });

    const user = await Users.findById(auth.userId);
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    if (user.twoFASecret !== String(code))
      return NextResponse.json({ success: false, message: "Invalid code" }, { status: 400 });

    user.twoFAEnabled = true;
    user.twoFASecret  = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: "2FA enabled successfully" });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
