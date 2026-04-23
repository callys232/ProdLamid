import mongoose from "mongoose";

const EscrowSchema = new mongoose.Schema({
    milestoneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Milestone",
        required: true,
    },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "funded", "released", "canceled"],
        default: "pending",
    },
    paystackRef: { type: String },
    transactionId: { type: String },
    fundedAt: { type: Date },
}, { timestamps: true });

export const Escrow = mongoose.models.Escrow || mongoose.model("Escrow", EscrowSchema);
export { EscrowSchema };
