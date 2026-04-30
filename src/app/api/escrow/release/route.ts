import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Escrow } from "@/lib/models/Escrow";
import { Users } from "@/lib/models/User";
import { Profile } from "@/lib/models/Profile";
import { initiatePaystackTransfer } from "@/lib/paystack";
import { emailPaymentReleased } from "@/lib/services/transactionalEmailService";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const { escrowId } = await request.json();
    if (!escrowId) return NextResponse.json({ success: false, message: "escrowId is required" }, { status: 400 });

    const escrow = await Escrow.findById(escrowId).lean() as any;
    if (!escrow) return NextResponse.json({ success: false, message: "Escrow not found" }, { status: 404 });
    if (escrow.status !== "funded") return NextResponse.json({ success: false, message: "Escrow must be funded before release" }, { status: 400 });

    // Find the consultant (recipient of funds)
    const consultantId = escrow.consultantId ?? escrow.userId;
    const profile = consultantId ? await Profile.findOne({ user: consultantId }).lean() as any : null;

    let transferData: any = null;

    if (profile?.bankAccount && profile?.routingNumber) {
      transferData = await initiatePaystackTransfer({
        name:           profile.firstName ? `${profile.firstName} ${profile.lastName ?? ""}`.trim() : "Consultant",
        account_number: profile.bankAccount,
        bank_code:      profile.routingNumber,
        amount:         escrow.amount,
        reason:         `Milestone payment — escrow ${escrowId}`,
      });
    }

    // Mark escrow as released regardless (transfer may be manual if no bank on file)
    await Escrow.findByIdAndUpdate(escrowId, { $set: { status: "released" } });

    // Transactional email to consultant
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
        : "Escrow marked released. Add bank details to enable automatic transfer.",
      transfer: transferData,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
