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
        /* "disputed" and "refunded" were being written by the dispute and refund
           paths without ever being declared. Mongoose skips validators on update
           by default, so those writes succeeded and put rows into states the
           schema did not acknowledge — which is why disputed money never showed
           up in any admin total. */
        enum:    ["pending", "initializing", "funded", "releasing", "released", "canceled", "disputed", "refunded"],
        default: "pending",
    },

    /* ── Dispute ──
       These fields were being $set by /api/escrow/dispute but were absent from
       the schema, so strict mode stripped every one of them: the reason and the
       evidence for each dispute were silently discarded. */
    disputeReason:   { type: String },
    disputeEvidence: [{ type: String }],
    disputedBy:      { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    disputedAt:      { type: Date },

    /* ── Resolution — who settled it, how, and why ── */
    resolution: {
        outcome:    { type: String, enum: ["released", "refunded", "canceled"] },
        note:       { type: String },
        resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        resolvedAt: { type: Date },
    },

    /* Set when an administrator overrides the normal party-driven flow. */
    adminAction: {
        action:      { type: String, enum: ["release", "refund", "cancel", "resolve"] },
        reason:      { type: String },
        performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        performedAt: { type: Date },
    },
    paystackRef:      { type: String, unique: true, sparse: true },
    authorizationUrl: { type: String },   // stored for idempotent retries
    transactionId:    { type: String },
    idempotencyKey:   { type: String, unique: true, sparse: true },
    fundedAt:         { type: Date },
    releasedAt:       { type: Date },
    consultantId:     { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    clientId:         { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    projectId:        { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
}, { timestamps: true });

// Indexes for atomic lookups
EscrowSchema.index({ status: 1 });
EscrowSchema.index({ milestoneId: 1 });
EscrowSchema.index({ paystackRef: 1 });

export const Escrow = mongoose.models.Escrow || mongoose.model("Escrow", EscrowSchema);
export { EscrowSchema };
