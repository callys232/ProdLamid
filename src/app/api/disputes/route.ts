import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import EscrowTransaction from "@/lib/models/EscrowTransaction";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { escrowId, raisedBy, reason, evidence, description } = await req.json();

    if (!escrowId || !raisedBy || !reason) {
      return NextResponse.json({ message: "escrowId, raisedBy, and reason are required." }, { status: 400 });
    }

    const escrow = await EscrowTransaction.findById(escrowId);
    if (!escrow) return NextResponse.json({ message: "Escrow not found." }, { status: 404 });

    if (escrow.status === "disputed") {
      return NextResponse.json({ message: "A dispute is already open for this transaction." }, { status: 409 });
    }

    escrow.status = "disputed";
    escrow.dispute = {
      raisedBy,
      reason,
      description: description || "",
      evidence: evidence || [],
      raisedAt: new Date(),
      status: "open",
    };

    await escrow.save();
    return NextResponse.json({ message: "Dispute raised successfully.", escrow }, { status: 200 });
  } catch (error) {
    console.error("Dispute POST error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const escrowId = searchParams.get("escrowId");

    if (!escrowId) return NextResponse.json({ message: "escrowId required." }, { status: 400 });

    const escrow = await EscrowTransaction.findById(escrowId).select("status dispute amount currency");
    if (!escrow) return NextResponse.json({ message: "Not found." }, { status: 404 });

    return NextResponse.json({ dispute: escrow.dispute, status: escrow.status, amount: escrow.amount, currency: escrow.currency });
  } catch (error) {
    console.error("Dispute GET error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
