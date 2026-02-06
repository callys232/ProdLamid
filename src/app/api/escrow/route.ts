import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { EscrowTransaction } from "@/lib/models/EscrowTransaction";
import { Wallet } from "@/lib/models/Wallet";
import { Project } from "@/lib/models/Project";
import mongoose from "mongoose";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const projectId = searchParams.get("projectId");

        const query: any = {};
        if (projectId) query.projectId = projectId;

        // If we want to filter by user, we might need to join with Project to find projects owned by or assigned to the user
        // For now, let's return transactions for a specific project

        const transactions = await EscrowTransaction.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: transactions });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { projectId, milestoneId, amount, userId } = body;

        if (!projectId || !amount || !userId) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // 1. Create Escrow Transaction
        const transaction = await EscrowTransaction.create({
            projectId,
            milestoneId,
            amount,
            status: "funded",
            action: "Funded milestone",
            type: "credit"
        });

        // 2. Update Project/Milestone status (simplified)
        await Project.updateOne(
            { _id: projectId, "milestones._id": milestoneId },
            { $set: { "milestones.$.status": "funded" } }
        );

        // 3. Update Wallet - Deduct from client (debit) or just hold it
        // In a real escrow, we'd move funds from user wallet to escrow wallet
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
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { transactionId, status, freelancerId } = body;

        if (!transactionId || !status) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const transaction = await EscrowTransaction.findByIdAndUpdate(
            transactionId,
            { status, updatedAt: new Date().toISOString() },
            { new: true }
        );

        if (!transaction) {
            return NextResponse.json({ success: false, message: "Transaction not found" }, { status: 404 });
        }

        // If released, update freelancer wallet
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
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
