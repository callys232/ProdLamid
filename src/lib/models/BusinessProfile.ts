import mongoose from "mongoose";

const BusinessProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    companyName: { type: String },
    companySize: { type: String },
    website: { type: String },
    description: { type: String },
    industry: { type: String },
    location: { type: String },
}, { timestamps: true });

export const BusinessProfile =
    mongoose.models.BusinessProfile || mongoose.model("BusinessProfile", BusinessProfileSchema);
