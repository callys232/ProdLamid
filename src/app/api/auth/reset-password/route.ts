import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import connectDB from "@/lib/db";
import { Users } from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { token, email, password } = await req.json();

    if (!token || !email || !password)
      return NextResponse.json({ success: false, message: "Token, email, and new password are required" }, { status: 400 });

    if (password.length < 8)
      return NextResponse.json({ success: false, message: "Password must be at least 8 characters" }, { status: 400 });

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await Users.findOne({
      email:            email.toLowerCase().trim(),
      resetToken:       tokenHash,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user)
      return NextResponse.json({ success: false, message: "Invalid or expired reset link" }, { status: 400 });

    user.password         = await bcrypt.hash(password, 10);
    user.resetToken       = null;
    user.resetTokenExpiry = null;
    await user.save();

    return NextResponse.json({ success: true, message: "Password reset successfully. You can now sign in." });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
