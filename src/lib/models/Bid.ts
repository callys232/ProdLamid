import mongoose from "mongoose";

const BidSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    bidderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", // or "User" depending on your model registration name
        required: true,
    },
    amount: { type: Number, required: true },
    duration: { type: String }, // e.g. "2 Weeks"
    coverLetter: { type: String },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "withdrawn"],
        default: "pending",
    },
    accepted: { type: Boolean, default: false },
    denied: { type: Boolean, default: false },
    name: { type: String }, // redundant but useful snapshot
    email: { type: String }, // redundant but useful snapshot
}, { timestamps: true });

export const Bid = mongoose.models.Bid || mongoose.model("Bid", BidSchema);
