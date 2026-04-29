import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Escrow } from "@/lib/models/Escrow";
import { Users } from "@/lib/models/User";
import { initializePayment } from "@/lib/paystack";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const { escrowId, milestoneId } = await request.json();
    if (!escrowId) return NextResponse.json({ success: false, message: "escrowId is required" }, { status: 400 });

    const escrow = await Escrow.findById(escrowId) as any;
    if (!escrow) return NextResponse.json({ success: false, message: "Escrow not found" }, { status: 404 });
    if (escrow.status === "funded") return NextResponse.json({ success: false, message: "Already funded" }, { status: 400 });

    const user = await Users.findById(auth.userId).lean() as any;
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    const paymentData = await initializePayment(user.email, escrow.amount, {
      escrowId,
      milestoneId: milestoneId ?? escrow.milestoneId,
      userId: auth.userId,
      type: "escrow_fund",
    });

    // Store reference so webhook can match it back
    escrow.paystackRef = paymentData.reference;
    await escrow.save();

    return NextResponse.json({
      success: true,
      message: "Payment initiated. Complete payment via the link.",
      authorizationUrl: paymentData.authorization_url,
      reference:        paymentData.reference,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
