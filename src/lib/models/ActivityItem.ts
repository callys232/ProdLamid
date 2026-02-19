import mongoose from "mongoose";

const ActivityItemSchema = new mongoose.Schema({
    action: { type: String, required: true },
    user: { type: String, required: true },
    timestamp: { type: String, required: true },
    details: { type: String },
    type: { type: String, enum: ["system", "user"], default: "user" }
});

export { ActivityItemSchema };
export const ActivityItem = mongoose.models.ActivityItem || mongoose.model("ActivityItem", ActivityItemSchema);
