import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import { Users } from "@/lib/models/User";
import { sendResetEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });

    const user = await Users.findOne({ email: email.toLowerCase().trim() });

    // Always return success to prevent email enumeration
    if (!user) return NextResponse.json({ success: true, message: "If that email exists, a reset link has been sent." });

    const token      = crypto.randomBytes(32).toString("hex");
    const expiry     = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetToken       = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/forgotpassword?token=${token}&email=${encodeURIComponent(email)}`;

    await sendResetEmail(email, resetUrl);

    return NextResponse.json({ success: true, message: "If that email exists, a reset link has been sent." });
  } catch (e: any) {
    console.error("Forgot password error:", e);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}
