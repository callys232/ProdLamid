import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";
import { Users } from "@/lib/models/User";
import { initializePayment } from "@/lib/paystack";

// POST /api/wallet/topup — initiate Paystack payment to top up wallet
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    const engineBlock = denyEngineUsers(auth);
    if (engineBlock) return engineBlock;

    const { amount } = await req.json();
    if (!amount || amount < 100) return NextResponse.json({ success: false, message: "Minimum top-up is ₦100" }, { status: 400 });

    const user = await Users.findById(auth.userId).lean() as any;
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    const paymentData = await initializePayment(user.email, amount, {
      userId: auth.userId,
      type: "wallet_topup",
    });

    return NextResponse.json({ success: true, authorizationUrl: paymentData.authorization_url, reference: paymentData.reference });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
