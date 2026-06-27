import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String }, // Primary thumbnail
    images: [
        {
            path: { type: String, required: true },
            alt: { type: String },
        },
    ],
    date: { type: String }, // Storing as string for flexibility/alignment with mocks, could be Date
    time: { type: String },
    location: { type: String },
    category: { type: String }, // e.g. "Job Scoping", "Reskilling"
    type: {
        type: String,
        enum: ["hcd", "biz", "general"],
        default: "general",
    },
    eventTitle: { type: String }, // Optional extra title field from types
}, { timestamps: true });

export const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);
