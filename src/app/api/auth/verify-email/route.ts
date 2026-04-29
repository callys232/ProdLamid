import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Users } from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, code } = await req.json();

    if (!email || !code)
      return NextResponse.json({ success: false, message: "Email and code required" }, { status: 400 });

    const user = await Users.findOne({ email: email.toLowerCase().trim() });
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    if (user.isVerified) return NextResponse.json({ success: true, message: "Already verified" });

    if (user.verificationCode !== String(code))
      return NextResponse.json({ success: false, message: "Invalid verification code" }, { status: 400 });

    user.isVerified      = true;
    user.verificationCode = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: "Email verified successfully" });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
