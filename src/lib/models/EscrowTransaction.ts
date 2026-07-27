import mongoose from "mongoose";

const EscrowTransactionSchema = new mongoose.Schema({
    projectId: { type: String, required: true },
    milestoneId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: {
        type: String,
        /* "disputed" was missing. /api/disputes assigns it then calls save(),
           which — unlike an update — does run validators, so raising a dispute
           through that route failed with a ValidationError and returned a 500
           every time. */
        enum: ["pending", "funded", "released", "failed", "disputed", "refunded"],
        default: "pending"
    },

    /* The dispute payload /api/disputes writes. Undeclared until now, so strict
       mode discarded it even when the status write did not throw. */
    dispute: {
        raisedBy:    { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        reason:      { type: String },
        description: { type: String },
        evidence:    [{ type: String }],
        raisedAt:    { type: Date },
        status:      { type: String, enum: ["open", "resolved", "rejected"], default: "open" },
        outcome:     { type: String, enum: ["released", "refunded", "canceled"] },
        resolvedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        resolvedAt:  { type: Date },
        resolutionNote: { type: String },
    },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
    date: { type: String },
    type: { type: String },
    action: { type: String }
});

export { EscrowTransactionSchema };
export const EscrowTransaction = mongoose.models.EscrowTransaction || mongoose.model("EscrowTransaction", EscrowTransactionSchema);
