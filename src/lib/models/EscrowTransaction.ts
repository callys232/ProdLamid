import mongoose from "mongoose";

const EscrowTransactionSchema = new mongoose.Schema({
    projectId: { type: String, required: true },
    milestoneId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: {
        type: String,
        enum: ["pending", "funded", "released", "failed"],
        default: "pending"
    },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
    date: { type: String },
    type: { type: String },
    action: { type: String }
});

export const EscrowTransaction = mongoose.models.EscrowTransaction || mongoose.model("EscrowTransaction", EscrowTransactionSchema);
