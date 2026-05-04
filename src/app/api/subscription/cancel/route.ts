import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Users } from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const user = await Users.findById(auth.userId) as any;
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    if (!user.subscriptionId) return NextResponse.json({ success: false, message: "No active subscription" }, { status: 400 });

    // Disable subscription via Paystack
    const res = await fetch("https://api.paystack.co/subscription/disable", {
      method:  "POST",
      headers: {
        Authorization:  `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code:  user.subscriptionId,
        token: user.subscriptionEmailToken ?? "",
      }),
    });
    const data = await res.json();
    if (!res.ok && data.status !== false) throw new Error(data.message ?? "Failed to cancel");

    user.subscriptionStatus = "cancelled";
    user.tier               = "free";
    await user.save();

    return NextResponse.json({ success: true, message: "Subscription cancelled. Access continues until end of billing period." });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
