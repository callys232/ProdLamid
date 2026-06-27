import mongoose from "mongoose";

const PaymentInfoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    walletAddress: { type: String },
    network: { type: String },
    bankAccount: { type: String },
    routingNumber: { type: String },
    bankName: { type: String },
}, { timestamps: true });

export const PaymentInfo =
    mongoose.models.PaymentInfo || mongoose.model("PaymentInfo", PaymentInfoSchema);
