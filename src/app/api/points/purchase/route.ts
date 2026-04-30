import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Users } from "@/lib/models/User";
import { POINT_PACKAGES } from "@/lib/services/pointsService";
import { initializePayment } from "@/lib/paystack";

// POST /api/points/purchase — initiate Paystack payment for a points package
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { packageId } = await req.json();
    const pkg = POINT_PACKAGES.find(p => p.id === packageId);
    if (!pkg) return NextResponse.json({ success: false, message: "Invalid package" }, { status: 400 });

    const user = await Users.findById(auth.userId).lean() as any;
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    const paymentData = await initializePayment(user.email, pkg.priceNgn, {
      userId:    auth.userId,
      type:      "points_purchase",
      packageId: pkg.id,
      points:    pkg.points,
    });

    return NextResponse.json({
      success:          true,
      authorizationUrl: paymentData.authorization_url,
      reference:        paymentData.reference,
      package:          pkg,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
