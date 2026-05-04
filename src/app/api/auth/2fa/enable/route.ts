import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Users } from "@/lib/models/User";
import { sendVerificationEmail } from "@/lib/mailer";

// POST /api/auth/2fa/enable — sends a 6-digit OTP to the user's email
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const user = await Users.findById(auth.userId);
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    if (user.twoFAEnabled) return NextResponse.json({ success: false, message: "2FA already enabled" }, { status: 400 });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.twoFASecret = code;
    user.twoFAMethod = "email";
    await user.save();

    await sendVerificationEmail(user.email, code);

    return NextResponse.json({ success: true, message: "Verification code sent to your email" });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
