import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Escrow } from "@/lib/models/Escrow";

export const dynamic = "force-dynamic";

/**
 * Administrative escrow control.
 *
 * Of the thirteen escrow routes only `release` recognised an administrator, and
 * it rate-limited them like a client. Nothing could cancel a stuck escrow,
 * refund a client, or settle a dispute — once raised, a dispute was terminal.
 *
 * Every action here records who did it and why on the escrow itself, because an
 * override that leaves no trail is worse than no override.
 */

type Action = "release" | "refund" | "cancel" | "resolve";

/** Which statuses each action may be applied to. */
const ALLOWED_FROM: Record<Action, string[]> = {
  release: ["funded", "releasing", "disputed"],
  refund:  ["funded", "disputed"],
  cancel:  ["pending", "initializing", "funded", "disputed"],
  resolve: ["disputed"],
};

const RESULTING_STATUS: Record<Exclude<Action, "resolve">, string> = {
  release: "released",
  refund:  "refunded",
  cancel:  "canceled",
};

/** GET — the queue an administrator works from. */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (auth.userRole !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const status = req.nextUrl.searchParams.get("status") ?? "disputed";
    const limit  = Math.min(Math.max(Number(req.nextUrl.searchParams.get("limit")) || 50, 1), 200);

    const [rows, counts] = await Promise.all([
      Escrow.find(status === "all" ? {} : { status })
        .sort({ disputedAt: -1, updatedAt: -1 })
        .limit(limit)
        .populate("clientId", "username email")
        .populate("consultantId", "username email")
        .lean(),
      Escrow.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 }, amount: { $sum: "$amount" } } },
      ]),
    ]);

    const byStatus = Object.fromEntries(
      counts.map((c) => [c._id ?? "unknown", { count: c.count, amount: c.amount ?? 0 }])
    );

    return NextResponse.json({
      escrows: rows,
      byStatus,
      /* Money that is neither released nor returned — the figure the finance
         panel omitted entirely. */
      heldInDispute: byStatus.disputed?.amount ?? 0,
    });
  } catch (e: unknown) {
    console.error("[Admin/Escrow] GET", e);
    return NextResponse.json({ error: "Could not load escrows." }, { status: 500 });
  }
}

/** PATCH — perform an action on one escrow. */
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (auth.userRole !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { escrowId, action, reason, outcome } = await req.json() as {
      escrowId?: string; action?: Action; reason?: string; outcome?: "released" | "refunded" | "canceled";
    };

    if (!escrowId || !mongoose.Types.ObjectId.isValid(escrowId)) {
      return NextResponse.json({ message: "A valid escrowId is required." }, { status: 400 });
    }
    if (!action || !(action in ALLOWED_FROM)) {
      return NextResponse.json({ message: "action must be release, refund, cancel or resolve." }, { status: 400 });
    }
    // An override with no stated reason is not auditable, so it is not allowed.
    if (!reason?.trim()) {
      return NextResponse.json({ message: "A reason is required for every administrative action." }, { status: 400 });
    }
    if (action === "resolve" && !outcome) {
      return NextResponse.json({ message: "Resolving a dispute requires an outcome." }, { status: 400 });
    }

    const escrow = await Escrow.findById(escrowId);
    if (!escrow) return NextResponse.json({ message: "Escrow not found." }, { status: 404 });

    const from = String(escrow.status);
    if (!ALLOWED_FROM[action].includes(from)) {
      return NextResponse.json(
        { message: `Cannot ${action} an escrow that is ${from}.` },
        { status: 409 },
      );
    }

    const now = new Date();
    const nextStatus = action === "resolve" ? outcome! : RESULTING_STATUS[action];

    escrow.status = nextStatus;
    escrow.adminAction = { action, reason: reason.trim(), performedBy: auth.userId, performedAt: now };

    if (action === "resolve" || from === "disputed") {
      escrow.resolution = {
        outcome: nextStatus as "released" | "refunded" | "canceled",
        note: reason.trim(),
        resolvedBy: auth.userId,
        resolvedAt: now,
      };
    }
    if (nextStatus === "released") escrow.releasedAt = now;

    // save() runs validators, so an invalid status can no longer slip through.
    await escrow.save();

    return NextResponse.json({
      message: `Escrow ${action === "resolve" ? `resolved as ${nextStatus}` : nextStatus}.`,
      escrow: { _id: escrow._id, status: escrow.status, amount: escrow.amount },
    });
  } catch (e: unknown) {
    console.error("[Admin/Escrow] PATCH", e);
    const msg = e instanceof Error && e.name === "ValidationError"
      ? "The escrow could not be moved into that state."
      : "Action failed.";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
