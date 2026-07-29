import mongoose, { Schema } from "mongoose";

/**
 * One organisation profile per member — the shared figures every tool
 * prefills from, so the same details are never typed twice.
 */
const OrganizationProfileSchema = new Schema({
  userId:           { type: Schema.Types.ObjectId, ref: "Users", required: true, unique: true, index: true },
  organisationName: { type: String, trim: true, maxlength: 160 },
  industry:         { type: String, trim: true, maxlength: 120 },
  size:             { type: String, trim: true, maxlength: 60 },
  headcount:        { type: Number, min: 0, max: 10_000_000 },
  currency:         { type: String, trim: true, maxlength: 8, default: "USD" },
  region:           { type: String, trim: true, maxlength: 120 },
  periodLabel:      { type: String, enum: ["Month", "Quarter", "Week"], default: "Month" },
}, { timestamps: true });

export const OrganizationProfile =
  mongoose.models.OrganizationProfile ||
  mongoose.model("OrganizationProfile", OrganizationProfileSchema);
