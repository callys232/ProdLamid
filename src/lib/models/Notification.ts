import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["order", "system", "promo", "alert", "activity", "message"],
      default: "system",
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low"
    },
    relatedId: { type: String },
    relatedType: {
      type: String,
      enum: ["project", "consultant", "bid", "team", "other"]
    },
    read: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
    metadata: { type: Object }, // optional additional info
  },
  { timestamps: true }
);

export const Notification =
  mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);

