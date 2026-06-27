import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", // Client who owns the team
        required: true,
    },
    description: { type: String },
    members: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }, // Consultant
            role: { type: String }, // Optional override role in this team
            addedAt: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });

export const Team = mongoose.models.Team || mongoose.model("Team", TeamSchema);
