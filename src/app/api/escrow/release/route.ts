import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";
import { Escrow } from "@/lib/models/Escrow";
import { Users } from "@/lib/models/User";
import { Profile } from "@/lib/models/Profile";
import { initiatePaystackTransfer } from "@/lib/paystack";
import { emailPaymentReleased } from "@/lib/services/transactionalEmailService";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIP } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    const engineBlock = denyEngineUsers(auth);
    if (engineBlock) return engineBlock;

    /* Rate-limit: 2 release attempts per user per minute */
    const rl = await rateLimit(`escrow:release:${auth.userId}`, { windowMs: 60_000, max: 2 });
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, message: "Too many release requests. Please wait before trying again." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const { escrowId } = await request.json();
    if (!escrowId) {
      return NextResponse.json({ success: false, message: "escrowId is required" }, { status: 400 });
    }

    // ── Atomic transition: funded → releasing ─────────────────────────────
    // Prevents double-release race condition
    const escrow = await Escrow.findOneAndUpdate(
      { _id: escrowId, status: "funded" },
      { $set: { status: "releasing" } },
      { new: false }   // return the OLD doc so we have the consultant info
    ) as any;

    if (!escrow) {
      const current = await Escrow.findById(escrowId).lean() as any;
      if (!current) return NextResponse.json({ success: false, message: "Escrow not found" }, { status: 404 });
      if (current.status === "released") return NextResponse.json({ success: false, message: "Already released" }, { status: 409 });
      if (current.status === "releasing") return NextResponse.json({ success: false, message: "Release already in progress" }, { status: 409 });
      return NextResponse.json(
        { success: false, message: `Cannot release: escrow is ${current.status}` },
        { status: 400 }
      );
    }

    // Only the escrow owner (client who funded) or an admin can release
    const isOwner = String(escrow.userId ?? escrow.clientId) === auth.userId;
    const isAdmin = auth.userRole === "admin";
    if (!isOwner && !isAdmin) {
      // Roll back
      await Escrow.findByIdAndUpdate(escrowId, { $set: { status: "funded" } });
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const profile = escrow.consultantId
      ? (await Profile.findOne({ user: escrow.consultantId }).lean() as any)
      : null;

    let transferData: any = null;
    let releaseError: string | null = null;

    if (profile?.bankAccount && profile?.routingNumber) {
      try {
        transferData = await initiatePaystackTransfer({
          name: profile.firstName
            ? `${profile.firstName} ${profile.lastName ?? ""}`.trim()
            : "Consultant",
          account_number: profile.bankAccount,
          bank_code:      profile.routingNumber,
          amount:         escrow.amount,
          reason:         `Milestone payment — escrow ${escrowId}`,
        });
      } catch (transferErr: any) {
        releaseError = transferErr.message;
        // Don't fail the whole release — log and continue to mark released
        console.error("[Escrow release] Transfer failed:", transferErr.message);
      }
    }

    // Finalize: mark released
    await Escrow.findByIdAndUpdate(escrowId, {
      $set: {
        status:     "released",
        releasedAt: new Date(),
        ...(transferData?.reference && { releaseRef: transferData.reference }),
      },
    });

    // Notification email (non-blocking)
    const consultantId = escrow.consultantId ?? escrow.userId;
    if (consultantId) {
      emailPaymentReleased({
        consultantId: String(consultantId),
        amount:       escrow.amount,
        projectTitle: `Escrow #${escrowId}`,
        reference:    transferData?.reference,
      }).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      message: transferData
        ? "Funds released and bank transfer initiated."
        : releaseError
          ? `Escrow released. Bank transfer failed (${releaseError}) — manual payout required.`
          : "Escrow released. Add bank details to enable automatic transfer.",
      transfer: transferData,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
