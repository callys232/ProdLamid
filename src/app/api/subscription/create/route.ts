import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Users } from "@/lib/models/User";

export const dynamic = "force-dynamic";

// Paystack plan codes — create these in your Paystack dashboard and set in .env
// Plan intervals: monthly, quarterly (every 3 months), annual
const PLANS: Record<string, { code: string; cycle: "monthly" | "quarterly" | "annual" }> = {
  // Premium
  premium_monthly:   { code: process.env.PAYSTACK_PLAN_PREMIUM_MONTHLY    ?? "", cycle: "monthly"   },
  premium_quarterly: { code: process.env.PAYSTACK_PLAN_PREMIUM_QUARTERLY  ?? "", cycle: "quarterly" },
  premium_annual:    { code: process.env.PAYSTACK_PLAN_PREMIUM_ANNUAL     ?? "", cycle: "annual"    },
  // Enterprise (self-serve — mainly for SMB; larger orgs go through contact-sales)
  enterprise_monthly:   { code: process.env.PAYSTACK_PLAN_ENTERPRISE_MONTHLY    ?? "", cycle: "monthly"   },
  enterprise_quarterly: { code: process.env.PAYSTACK_PLAN_ENTERPRISE_QUARTERLY  ?? "", cycle: "quarterly" },
  enterprise_annual:    { code: process.env.PAYSTACK_PLAN_ENTERPRISE_ANNUAL     ?? "", cycle: "annual"    },
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { plan } = await req.json();
    const planDef = PLANS[plan];
    if (!planDef) return NextResponse.json({ success: false, message: "Invalid plan. Choose: premium_monthly, premium_quarterly, premium_annual" }, { status: 400 });
    if (!planDef.code) return NextResponse.json({ success: false, message: `Plan "${plan}" not yet configured. Contact support.` }, { status: 503 });

    const user = await Users.findById(auth.userId).lean() as any;
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    if (user.subscriptionStatus === "active")
      return NextResponse.json({ success: false, message: "Already subscribed. Cancel current plan first." }, { status: 400 });

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method:  "POST",
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email:    user.email,
        plan:     planDef.code,
        amount:   0,
        metadata: { userId: String(user._id), type: "subscription", plan, cycle: planDef.cycle },
        callback_url: `${process.env.NEXT_PUBLIC_URL}/client?tab=settings&subscription=success`,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Paystack error");

    return NextResponse.json({ success: true, authorizationUrl: data.data.authorization_url, reference: data.data.reference, cycle: planDef.cycle });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
