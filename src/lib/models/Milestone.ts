import mongoose from "mongoose";

const MilestoneSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    amount: { type: Number, required: true }, // NGN (multiply *100 for kobo)
    status: {
        type: String,
        enum: [
            "pending", "started", "funded", "stopped", "dispute", "approved", "completed",
            "submitted", "ai_certified", "ai_rejected", "released",
        ],
        default: "pending",
    },
    notes: { type: String },
    fileUrl: { type: String },
    startedAt: { type: Date },
    completedAt: { type: Date },

    // Deliverable submission
    deliverableUrls:    { type: [String], default: [] },
    deliverableNotes:   { type: String,  default: "" },
    acceptanceCriteria: { type: String,  default: "" },

    // AI Certification
    aiCertified:           { type: Boolean, default: false },
    aiCertifiedAt:         { type: Date,    default: null },
    aiCertificationReport: { type: String,  default: "" },
    aiCertificationScore:  { type: Number,  default: 0 },
    aiAutoReleaseAt:       { type: Date,    default: null },

    // Dispute AI arbitration
    aiDisputeVerdict: { type: String, enum: ["valid", "invalid", ""], default: "" },
    aiDisputeReport:  { type: String, default: "" },

    // Release metadata
    fundsReleasedAt: { type: Date,   default: null },
    releaseMethod:   { type: String, enum: ["client_approved", "auto_release", "dispute_overruled", ""], default: "" },
}, { timestamps: true });

export const Milestone = mongoose.models.Milestone || mongoose.model("Milestone", MilestoneSchema);
export { MilestoneSchema };
