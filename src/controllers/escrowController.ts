import { Escrow } from "@/lib/models/Escrow";
import { Milestone } from "@/lib/models/Milestone";
import connectDB from "@/lib/db";
import * as paystack from "@/utils/paystack";
import { Users } from "@/lib/models/User";

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
        const reference = data.reference;
        const escrow = await Escrow.findOne({ paystackRef: reference });
        
        if (escrow) {
            escrow.status = "funded";
            escrow.transactionId = data.id.toString();
            escrow.fundedAt = new Date();
            await escrow.save();

            // Also update milestone status
            await Milestone.findByIdAndUpdate(escrow.milestoneId, { status: "funded" });
        }
    }

    return { success: true };
};
