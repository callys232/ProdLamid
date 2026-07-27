import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { EscrowTransaction } from "@/lib/models/EscrowTransaction";
import { Project } from "@/lib/models/Project";
import { Users } from "@/lib/models/User";
import { Organization } from "@/lib/models/Organization";
import { visibleEscrowUserIds } from "@/lib/escrow/authorize";
import { requireAuth } from "@/lib/middleware/auth";

export const dynamic = "force-dynamic";

/**
 * Ledger view over escrow transactions.
 *
 * This route previously had no authentication of any kind and, with no
 * projectId supplied, ran find({}) — returning every escrow transaction on the
 * platform, with amounts and project ids, to any unauthenticated caller. The
 * `userId` it echoed back was read straight from the query string.
 *
 * Access now follows the same rule as the rest of escrow: entries belong to the
 * project's owner and its assigned consultants, and to nobody else.
 */
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        const projectId = request.nextUrl.searchParams.get("projectId");

        const query: Record<string, unknown> = {};

        if (auth.userRole === "admin") {
            if (projectId) query.projectId = projectId;
        } else {
            // EscrowTransaction carries no user reference, so membership is
            // resolved through the projects this caller actually belongs to.
            /* Projects belonging to this caller, plus those of any account
               they act for — the concierge clients they manage as dedicated PM,
               and the members of an organisation they own. */
            const entitled = await visibleEscrowUserIds(auth.userId, auth.userRole, { Users, Organization });
            const own = await Project.find(
                { $or: [{ ownerId: { $in: entitled } }, { consultants: { $in: entitled } }] },
                { _id: 1 },
            ).lean();
            const ownIds = own.map((p: any) => String(p._id));

            if (projectId) {
                // Another party's project reads as empty rather than forbidden.
                if (!ownIds.includes(String(projectId))) {
                    return NextResponse.json({ success: true, data: [] });
                }
                query.projectId = projectId;
            } else {
                if (ownIds.length === 0) return NextResponse.json({ success: true, data: [] });
                query.projectId = { $in: ownIds };
            }
        }

        const entries = await EscrowTransaction.find(query).sort({ createdAt: -1 }).lean();

        const ledgerEntries = entries.map((tx: any) => ({
            id:            tx._id,
            // The authenticated caller — not a value taken from the query string.
            userId:        auth.userId,
            projectId:     tx.projectId,
            currency:      tx.currency || "USD",
            amount:        tx.amount,
            debitAccount:  tx.status === "funded" ? "client_wallet" : "escrow_wallet",
            creditAccount: tx.status === "funded" ? "escrow_wallet" : "freelancer_wallet",
            createdAt:     tx.createdAt,
        }));

        return NextResponse.json({ success: true, data: ledgerEntries });
    } catch (error: any) {
        console.error("[Ledger] GET", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
