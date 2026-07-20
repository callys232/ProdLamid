import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";
import { Escrow } from "@/lib/models/Escrow";
import { Users } from "@/lib/models/User";
import { initializePayment } from "@/lib/paystack";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    const engineBlock = denyEngineUsers(auth);
    if (engineBlock) return engineBlock;

    // Rate limit: 5 payment initiations per minute per user
    const rl = await rateLimit(`escrow:fund:${auth.userId}`, { windowMs: 60_000, max: 5 });
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, message: "Too many payment requests. Please wait." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { escrowId, milestoneId, idempotencyKey } = body;

    if (!escrowId) {
      return NextResponse.json({ success: false, message: "escrowId is required" }, { status: 400 });
    }

    // ── Idempotency: if this key was already used, return the stored result ──
    if (idempotencyKey) {
      const existing = await Escrow.findOne({ idempotencyKey }).lean() as any;
      if (existing?.authorizationUrl) {
        return NextResponse.json({
          success: true,
          message: "Payment already initialized (idempotent).",
          authorizationUrl: existing.authorizationUrl,
          reference: existing.paystackRef,
          idempotent: true,
        });
      }
    }

    // ── Atomic status transition: pending → initializing ──────────────────
    // This prevents two simultaneous requests both passing the status check
    const escrow = await Escrow.findOneAndUpdate(
      { _id: escrowId, status: "pending" },
      { $set: { status: "initializing", ...(idempotencyKey && { idempotencyKey }) } },
      { new: true }
    ) as any;

    if (!escrow) {
      // Find out why it failed
      const current = await Escrow.findById(escrowId).lean() as any;
      if (!current) {
        return NextResponse.json({ success: false, message: "Escrow not found" }, { status: 404 });
      }
      if (current.status === "funded") {
        return NextResponse.json({ success: false, message: "Escrow already funded" }, { status: 409 });
      }
      if (current.status === "initializing" && current.authorizationUrl) {
        // Safe to return the existing payment link
        return NextResponse.json({
          success: true,
          message: "Payment already initialized.",
          authorizationUrl: current.authorizationUrl,
          reference: current.paystackRef,
        });
      }
      return NextResponse.json(
        { success: false, message: `Escrow is currently ${current.status}` },
        { status: 409 }
      );
    }

    const user = await Users.findById(auth.userId).lean() as any;
    if (!user) {
      // Roll back status
      await Escrow.findByIdAndUpdate(escrowId, { $set: { status: "pending" } });
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    let paymentData: any;
    try {
      paymentData = await initializePayment(user.email, escrow.amount, {
        escrowId,
        milestoneId: milestoneId ?? escrow.milestoneId,
        userId: auth.userId,
        type: "escrow_fund",
      });
    } catch (payErr: any) {
      // Roll back so user can retry
      await Escrow.findByIdAndUpdate(escrowId, {
        $set: { status: "pending" },
        $unset: { idempotencyKey: "" },
      });
      return NextResponse.json(
        { success: false, message: `Payment init failed: ${payErr.message}` },
        { status: 502 }
      );
    }

    // Store reference + URL atomically
    await Escrow.findByIdAndUpdate(escrowId, {
      $set: {
        paystackRef:      paymentData.reference,
        authorizationUrl: paymentData.authorization_url,
        // Keep status as "initializing" until webhook confirms charge.success
      },
    });

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
