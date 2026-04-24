import mongoose from "mongoose";
import { MilestoneSchema } from "./Milestone";
import { EscrowTransactionSchema } from "./EscrowTransaction";
import { ActivityItemSchema } from "./ActivityItem";

const WorkPhaseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    duration: { type: String, default: "TBD" },
    description: { type: String },
    order: { type: Number },
    status: {
        type: String,
        enum: ["pending", "active", "completed"],
        default: "pending"
    }
});

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
    workPhases: { type: [WorkPhaseSchema], default: [] },
    type: { type: String }, // e.g. "Full Time", "Contract", etc.
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
    tags: { type: [String], default: [] },
    purpose: { type: String },
    extraField: { type: String },
    escrow: { type: [EscrowTransactionSchema], default: [] },
    activities: { type: [ActivityItemSchema], default: [] }
}, { timestamps: true });

delete mongoose.models.Project;
export const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
