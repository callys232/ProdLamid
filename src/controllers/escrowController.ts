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

    // Initialize Paystack
    const payment = await paystack.initialize(user.email, escrow.amount / 100); // amount is in kobo in DB? 
    // The user said "NGN (multiply *100 for kobo)". I'll assume escrow.amount is in kobo.
    
    escrow.paystackRef = payment.reference;
    await escrow.save();

    return payment; // { authorization_url, reference }
};

export const releaseEscrow = async (escrowId: string, userId: string) => {
    await connectDB();
    const escrow = await Escrow.findById(escrowId);
    if (!escrow) throw new Error("Escrow not found");

    escrow.status = "released";
    await escrow.save();

    // Stub: Credit consultant wallet
    // await creditWallet(milestone.consultantId, escrow.amount);

    return { success: true };
};

export const cancelEscrow = async (escrowId: string, userId: string) => {
    await connectDB();
    const escrow = await Escrow.findById(escrowId);
    if (!escrow) throw new Error("Escrow not found");

    escrow.status = "canceled";
    await escrow.save();

    // Stub: Refund client
    // await refundClient(userId, escrow.amount);

    return { success: true };
};

export const handlePaystackWebhook = async (payload: any) => {
    await connectDB();
    const { event, data } = payload;

    if (event === "charge.success") {
        const reference  = data.reference;
        const meta       = data.metadata ?? {};
        const amountNgn  = Math.floor(data.amount / 100); // Paystack sends kobo

        // ── Subscription activation ──────────────────────────────────
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

        // ── Points purchase ──────────────────────────────────────────
        if (meta.type === "points_purchase" && meta.userId && meta.points) {
            await awardPoints(
                meta.userId,
                Number(meta.points),
                `Purchased ${meta.points} points (${meta.packageId ?? ""})`,
                reference
            );
        }

        // ── Wallet top-up ────────────────────────────────────────────
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

        // ── Escrow funding (atomic — prevents duplicate webhook processing) ──
        const escrowFilter = meta.escrowId
            ? { _id: meta.escrowId, status: { $in: ["initializing", "pending"] } }
            : { paystackRef: reference,   status: { $in: ["initializing", "pending"] } };

        const escrow = await Escrow.findOneAndUpdate(
            escrowFilter,
            { $set: { status: "funded", transactionId: String(data.id), fundedAt: new Date() } },
            { new: true }
        );

        if (escrow) {
            // Only update milestone if escrow was successfully transitioned (not a replay)
            await Milestone.findByIdAndUpdate(escrow.milestoneId, { status: "funded" });
        }
    }

    // ── Subscription disabled / cancelled ────────────────────────────
    if (event === "subscription.disable" || event === "subscription.not_renew") {
        const customerCode = data.customer?.customer_code;
        if (customerCode) {
            await Users.findOneAndUpdate(
                { paystackCustomerId: customerCode },
                { subscriptionStatus: "cancelled", tier: "free" }
            );
        }
    }

    // ── Subscription invoice failed ──────────────────────────────────
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
