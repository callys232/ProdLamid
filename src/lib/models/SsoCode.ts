import mongoose from "mongoose";

const SsoCodeSchema = new mongoose.Schema({
  code:        { type: String, required: true, unique: true, index: true },
  userId:      { type: String, required: true },
  email:       { type: String, required: true },
  name:        { type: String, default: "" },
  accountType: { type: String, default: "Engine" },
  used:        { type: Boolean, default: false },
  // TTL index: MongoDB auto-deletes documents 5 minutes after createdAt
  createdAt:   { type: Date, default: Date.now, expires: 300 },
});

export const SsoCode =
  mongoose.models.SsoCode || mongoose.model("SsoCode", SsoCodeSchema);
