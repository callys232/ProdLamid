import mongoose from "mongoose";
import { MilestoneSchema } from "./Milestone";
import { EscrowTransactionSchema } from "./EscrowTransaction";
import { ActivityItemSchema } from "./ActivityItem";

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    tech: { type: String },
    location: { type: String },
    budget: { type: Number },
    hourlyRate: { type: Number },
    rating: { type: Number, default: 0 },
    organization: { type: String },
    image: { type: String },
    images: { type: [String], default: [] },
    description: { type: String },
    milestones: { type: [MilestoneSchema], default: [] },
    type: { type: Number }, // 0 = fixed, 1 = hourly
    adminIds: { type: [String], default: [] },
    currentMilestoneId: { type: String },
    suggestedBidRange: {
        min: { type: Number },
        max: { type: Number }
    },
    consultants: { type: [mongoose.Schema.Types.ObjectId], ref: "Users", default: [] },
    priority: { type: String },
    deadline: { type: String },
    status: {
        type: String,
        enum: ["open", "ongoing", "completed", "cancelled"],
        default: "open"
    },
    teamId: { type: String },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    milestoneProgress: { type: Number, default: 0 },
    timeline: { type: String },
    skills: { type: [String], default: [] },
    escrow: { type: [EscrowTransactionSchema], default: [] },
    activities: { type: [ActivityItemSchema], default: [] }
}, { timestamps: true });

export const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
