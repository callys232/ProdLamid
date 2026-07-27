import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";
import { EscrowTransaction } from "@/lib/models/EscrowTransaction";
import { Wallet } from "@/lib/models/Wallet";
import { Project } from "@/lib/models/Project";
import { Users } from "@/lib/models/User";
import { Organization } from "@/lib/models/Organization";
import { visibleEscrowUserIds } from "@/lib/escrow/authorize";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;
        const engineBlock = denyEngineUsers(auth);
        if (engineBlock) return engineBlock;

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get("projectId");

        /* Without a projectId this ran find({}) and handed every escrow
           transaction on the platform to any signed-in caller. EscrowTransaction
           carries no user reference, so access is resolved through the projects
           the caller actually belongs to — as owner or as an assigned
           consultant. Administrators are unscoped. */
        const query: any = {};

        if (auth.userRole === "admin") {
            if (projectId) query.projectId = projectId;
        } else {
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
                // Asking about someone else's project returns nothing, not a 403.
                if (!ownIds.includes(String(projectId))) {
                    return NextResponse.json({ success: true, data: [] });
                }
                query.projectId = projectId;
            } else {
                if (ownIds.length === 0) return NextResponse.json({ success: true, data: [] });
                query.projectId = { $in: ownIds };
            }
        }

        const transactions = await EscrowTransaction.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: transactions });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;
        const engineBlock = denyEngineUsers(auth);
        if (engineBlock) return engineBlock;

        const body = await request.json();
        const { projectId, milestoneId, amount } = body;

        if (!projectId || !amount) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // Use authenticated user ID — never trust client-supplied userId
        const userId = auth.userId;

        const transaction = await EscrowTransaction.create({
            projectId,
            milestoneId,
            amount,
            status: "funded",
            action: "Funded milestone",
            type: "credit"
        });

        await Project.updateOne(
            { _id: projectId, "milestones._id": milestoneId },
            { $set: { "milestones.$.status": "funded" } }
        );

        const userWallet = await Wallet.findOne({ user: userId });
        if (userWallet) {
            userWallet.balance -= amount;
            userWallet.transactions.push({
                type: "debit",
                amount,
                description: `Escrow funding for project ${projectId}`,
                status: "success",
                date: new Date()
            });
            await userWallet.save();
        }

        return NextResponse.json({ success: true, data: transaction });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await connectDB();
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;
        const engineBlock = denyEngineUsers(auth);
        if (engineBlock) return engineBlock;

        const body = await request.json();
        const { transactionId, status, freelancerId } = body;

        if (!transactionId || !status) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const transaction = await EscrowTransaction.findById(transactionId);
        if (!transaction) {
            return NextResponse.json({ success: false, message: "Transaction not found" }, { status: 404 });
        }

        // Only admin can manually override transaction status
        if (auth.userRole !== "admin") {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        transaction.status = status;
        (transaction as any).updatedAt = new Date();
        await transaction.save();

        if (status === "released" && freelancerId) {
            const freelancerWallet = await Wallet.findOne({ user: freelancerId });
            if (freelancerWallet) {
                freelancerWallet.balance += transaction.amount;
                freelancerWallet.transactions.push({
                    type: "credit",
                    amount: transaction.amount,
                    description: `Escrow release for project ${transaction.projectId}`,
                    status: "success",
                    date: new Date()
                });
                await freelancerWallet.save();
            }
        }

        return NextResponse.json({ success: true, data: transaction });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
