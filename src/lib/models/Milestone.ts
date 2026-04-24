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
        enum: ["pending", "started", "funded", "stopped", "dispute", "approved", "completed"],
        default: "pending",
    },
    notes: { type: String },
    fileUrl: { type: String },
    startedAt: { type: Date },
    completedAt: { type: Date },
}, { timestamps: true });

export const Milestone = mongoose.models.Milestone || mongoose.model("Milestone", MilestoneSchema);
export { MilestoneSchema };
