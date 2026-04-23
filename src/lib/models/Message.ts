import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    type: {
        type: String,
        enum: ["text", "milestone_start", "milestone_stop", "dispute", "approval"],
        default: "text",
    },
    message: { type: String },
    milestoneId: { type: mongoose.Schema.Types.ObjectId, ref: "Milestone" },
    fileUrl: { type: String },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    sentAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);
export { MessageSchema };
