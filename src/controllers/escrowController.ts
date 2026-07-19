import { Escrow } from "@/lib/models/Escrow";
import { Milestone } from "@/lib/models/Milestone";
import { Wallet } from "@/lib/models/Wallet";
import connectDB from "@/lib/db";
import * as paystack from "@/utils/paystack";
import { Users } from "@/lib/models/User";
import { awardPoints } from "@/lib/services/pointsService";

export const fundEscrow = async (escrowId: string, userId: string) => {
    await connectDB();
    const escrow = await Escrow.findById(escrowId).populate("milestoneId");
    if (!escrow) throw new Error("Escrow not found");

    const user = await Users.findById(userId);
    if (!user) throw new Error("User not found");

    const payment = await paystack.initialize(user.email, escrow.amount / 100);

    escrow.paystackRef = payment.reference;
    await escrow.save();

    return payment;
};

export const releaseEscrow = async (escrowId: string, userId: string) => {
    await connectDB();
    const escrow = await Escrow.findById(escrowId) as any;
    if (!escrow) throw new Error("Escrow not found");

    if (escrow.status === "released") return { success: true, alreadyReleased: true };

    escrow.status = "released";
    escrow.releasedAt = new Date();
    await escrow.save();

    // Credit consultant wallet
    if (escrow.consultantId) {
        let wallet = await Wallet.findOne({ user: escrow.consultantId });
        if (!wallet) wallet = await Wallet.create({ user: escrow.consultantId, balance: 0, transactions: [] });
        wallet.balance += escrow.amount;
        wallet.transactions.push({
            type: "credit",
            amount: escrow.amount,
            description: `Escrow release for project ${escrow.projectId}`,
            status: "success",
            date: new Date(),
        });
        await wallet.save();
    }

    return { success: true };
};

export const cancelEscrow = async (escrowId: string, userId: string) => {
    await connectDB();
    const escrow = await Escrow.findById(escrowId) as any;
    if (!escrow) throw new Error("Escrow not found");

    if (escrow.status === "canceled") return { success: true, alreadyCanceled: true };

    escrow.status = "canceled";
    await escrow.save();

    // Refund the client who funded this escrow
    const clientId = escrow.clientId ?? userId;
    if (clientId) {
        let wallet = await Wallet.findOne({ user: clientId });
        if (!wallet) wallet = await Wallet.create({ user: clientId, balance: 0, transactions: [] });
        wallet.balance += escrow.amount;
        wallet.transactions.push({
            type: "credit",
            amount: escrow.amount,
            description: `Escrow refund for project ${escrow.projectId}`,
            status: "success",
            date: new Date(),
        });
        await wallet.save();
    }

    return { success: true };
};

export const handlePaystackWebhook = async (payload: any) => {
    await connectDB();
    const { event, data } = payload;

    if (event === "charge.success") {
        const reference  = data.reference;
        const meta       = data.metadata ?? {};
        const amountNgn  = Math.floor(data.amount / 100);

        if (meta.type === "subscription" && meta.userId) {
            const cycle: "monthly" | "quarterly" | "annual" =
                meta.cycle ?? (
                    meta.plan?.includes("annual")    ? "annual"    :
                    meta.plan?.includes("quarterly") ? "quarterly" : "monthly"
                );
            const tier =
                meta.plan?.startsWith("enterprise") ? "enterprise" : "premium";

            await Users.findByIdAndUpdate(meta.userId, {
                tier,
                subscriptionStatus: "active",
                subscriptionCycle:  cycle,
            });
        }

        if (meta.type === "points_purchase" && meta.userId && meta.points) {
            await awardPoints(
                meta.userId,
                Number(meta.points),
                `Purchased ${meta.points} points (${meta.packageId ?? ""})`,
                reference
            );
        }

        if (meta.type === "wallet_topup" && meta.userId) {
            let wallet = await Wallet.findOne({ user: meta.userId });
            if (!wallet) wallet = await Wallet.create({ user: meta.userId });
            wallet.balance += amountNgn;
            wallet.transactions.push({
                type:        "credit",
                amount:      amountNgn,
                description: "Wallet top-up via Paystack",
                reference,
            });
            await wallet.save();
        }

        const escrowFilter = meta.escrowId
            ? { _id: meta.escrowId, status: { $in: ["initializing", "pending"] } }
            : { paystackRef: reference,   status: { $in: ["initializing", "pending"] } };

        const escrow = await Escrow.findOneAndUpdate(
            escrowFilter,
            { $set: { status: "funded", transactionId: String(data.id), fundedAt: new Date() } },
            { new: true }
        );

        if (escrow) {
            await Milestone.findByIdAndUpdate((escrow as any).milestoneId, { status: "funded" });
        }
    }

    if (event === "subscription.disable" || event === "subscription.not_renew") {
        const customerCode = data.customer?.customer_code;
        if (customerCode) {
            await Users.findOneAndUpdate(
                { paystackCustomerId: customerCode },
                { subscriptionStatus: "cancelled", tier: "free" }
            );
        }
    }

    if (event === "invoice.payment_failed") {
        const customerCode = data.customer?.customer_code;
        if (customerCode) {
            await Users.findOneAndUpdate(
                { paystackCustomerId: customerCode },
                { subscriptionStatus: "inactive" }
            );
        }
    }

    return { success: true };
};
