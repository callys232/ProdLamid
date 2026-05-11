import mongoose from "mongoose";

const EscrowSchema = new mongoose.Schema({
    milestoneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Milestone",
        required: true,
    },
    amount:       { type: Number, required: true },
    status: {
        type:    String,
        enum:    ["pending", "initializing", "funded", "releasing", "released", "canceled"],
        default: "pending",
    },
    paystackRef:      { type: String, unique: true, sparse: true },
    authorizationUrl: { type: String },   // stored for idempotent retries
    transactionId:    { type: String },
    idempotencyKey:   { type: String, unique: true, sparse: true },
    fundedAt:         { type: Date },
    releasedAt:       { type: Date },
    consultantId:     { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    projectId:        { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
}, { timestamps: true });

// Indexes for atomic lookups
EscrowSchema.index({ status: 1 });
EscrowSchema.index({ milestoneId: 1 });
EscrowSchema.index({ paystackRef: 1 });

export const Escrow = mongoose.models.Escrow || mongoose.model("Escrow", EscrowSchema);
export { EscrowSchema };
