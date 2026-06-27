import mongoose from "mongoose";

const EmploymentHistorySchema = new mongoose.Schema({
    company:     { type: String, required: true },
    role:        { type: String, required: true },
    startDate:   { type: String },          // "YYYY-MM"
    endDate:     { type: String },          // "YYYY-MM" or "Present"
    location:    { type: String },
    description: { type: String },
}, { _id: true, timestamps: false });

const BusinessProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    companyName:       { type: String },
    companySize:       { type: String, enum: ["1–10", "11–50", "51–200", "201–500", "501–1,000", "1,000+"] },
    website:           { type: String },
    description:       { type: String },
    industry:          { type: String },
    location:          { type: String },
    employmentHistory: { type: [EmploymentHistorySchema], default: [] },
}, { timestamps: true });

export const BusinessProfile =
    mongoose.models.BusinessProfile || mongoose.model("BusinessProfile", BusinessProfileSchema);
