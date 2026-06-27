import mongoose from "mongoose";

const InvitationSchema = new mongoose.Schema({
    invitedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
    },
    email: {
        type: String,
    },
    consultantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    method: {
        type: String,
        enum: ["email", "consultant", "ai"],
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "declined"],
        default: "pending",
    },
}, { timestamps: true });

export const Invitation = mongoose.models.Invitation || mongoose.model("Invitation", InvitationSchema);
