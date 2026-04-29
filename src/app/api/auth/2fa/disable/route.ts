import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Users } from "@/lib/models/User";

// POST /api/auth/2fa/disable — disables 2FA (requires password confirmation)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { password } = await req.json();
    if (!password) return NextResponse.json({ success: false, message: "Password required to disable 2FA" }, { status: 400 });

    const user = await Users.findById(auth.userId);
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    if (!user.twoFAEnabled) return NextResponse.json({ success: false, message: "2FA is not enabled" }, { status: 400 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });

    user.twoFAEnabled = false;
    user.twoFASecret  = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: "2FA disabled" });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
