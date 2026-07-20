import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";
import { EscrowTransaction } from "@/lib/models/EscrowTransaction";
import { Wallet } from "@/lib/models/Wallet";
import { Project } from "@/lib/models/Project";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;
        const engineBlock = denyEngineUsers(auth);
        if (engineBlock) return engineBlock;

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get("projectId");

        const query: any = {};
        if (projectId) query.projectId = projectId;

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
