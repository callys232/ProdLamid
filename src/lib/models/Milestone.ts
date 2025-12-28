import mongoose from "mongoose";

const MilestoneSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    amount: { type: Number },
    dueDate: { type: String },
    progress: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["pending", "in_progress", "funded", "released", "completed", "cancelled", "disputed"],
        default: "pending"
    },
    deadline: { type: String }
});

export const Milestone = mongoose.models.Milestone || mongoose.model("Milestone", MilestoneSchema);
export { MilestoneSchema };
