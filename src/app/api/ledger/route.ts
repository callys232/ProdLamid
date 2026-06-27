import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { EscrowTransaction } from "@/lib/models/EscrowTransaction";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const projectId = searchParams.get("projectId");

        // Ledger entries for the high-fidelity EscrowDashboard are effectively 
        // a filtered view of EscrowTransactions or a separate model.
        // For simplicity, we'll use EscrowTransactions as ledger entries.

        const query: any = {};
        if (projectId) query.projectId = projectId;

        const entries = await EscrowTransaction.find(query).sort({ createdAt: -1 });

        // Map to LedgerEntry type from project.ts
        const ledgerEntries = entries.map((tx: any) => ({
            id: tx._id,
            userId: userId, // Placeholder
            projectId: tx.projectId,
            currency: tx.currency || "USD",
            amount: tx.amount,
            debitAccount: tx.status === "funded" ? "client_wallet" : "escrow_wallet",
            creditAccount: tx.status === "funded" ? "escrow_wallet" : "freelancer_wallet",
            createdAt: tx.createdAt
        }));

        return NextResponse.json({ success: true, data: ledgerEntries });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
