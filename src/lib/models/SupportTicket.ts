import mongoose from "mongoose";

const SupportTicketSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  subject:  { type: String, required: true },
  message:  { type: String, required: true },
  priority: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
  category: { type: String, enum: ["general", "billing", "reports", "escrow", "technical", "other"], default: "general" },
  status:   { type: String, enum: ["open", "in-progress", "resolved", "closed"], default: "open" },
  resolvedAt: { type: Date },
  notes:    { type: String }, // internal admin notes
}, { timestamps: true });

export const SupportTicket =
  mongoose.models.SupportTicket || mongoose.model("SupportTicket", SupportTicketSchema);
