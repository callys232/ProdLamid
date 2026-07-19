import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import { Users } from "@/lib/models/User";
import { sendResetEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const rl = await rateLimit(`forgot:${ip}`, { windowMs: 60 * 60 * 1000, max: 5 });
    if (!rl.allowed) return NextResponse.json({ success: false, message: "Too many requests. Try again later." }, { status: 429 });

    await connectDB();
    const { email } = await req.json();

    if (!email) return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });

    const user = await Users.findOne({ email: email.toLowerCase().trim() });

    // Always return success to prevent email enumeration
    if (!user) return NextResponse.json({ success: true, message: "If that email exists, a reset link has been sent." });

    const rawToken   = crypto.randomBytes(32).toString("hex");
    const tokenHash  = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiry     = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetToken       = tokenHash;
    user.resetTokenExpiry = expiry;
    await user.save();

    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/forgotpassword?token=${rawToken}&email=${encodeURIComponent(email)}`;

    await sendResetEmail(email, resetUrl);

    return NextResponse.json({ success: true, message: "If that email exists, a reset link has been sent." });
  } catch (e: any) {
    console.error("Forgot password error:", e);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}
