import mongoose, { Schema } from "mongoose";

const OrgSettingsSchema = new Schema({
  allowPublicProjects:     { type: Boolean, default: true },
  requireApprovalForBids:  { type: Boolean, default: false },
  defaultProjectBudgetCap: { type: Number },
  whiteLabelEnabled:       { type: Boolean, default: false },
}, { _id: false });

const OrganizationSchema = new Schema({
  name:             { type: String, required: true, trim: true },
  slug:             { type: String, required: true, unique: true, lowercase: true, trim: true },
  tier:             { type: String, enum: ["enterprise", "enterprise_plus"], default: "enterprise" },
  maxMembers:       { type: Number, default: 50 },
  ownerId:          { type: Schema.Types.ObjectId, ref: "Users", required: true },
  logoUrl:          { type: String },
  industry:         { type: String },
  website:          { type: String },
  billingCycle:     { type: String, enum: ["monthly", "annual"], default: "monthly" },
  isPaid:           { type: Boolean, default: false },
  stripeCustomerId: { type: String },
  status:           { type: String, enum: ["trial", "active", "suspended"], default: "trial" },
  settings:         { type: OrgSettingsSchema, default: () => ({}) },
}, { timestamps: true });

export const Organization =
  mongoose.models.Organization ||
  mongoose.model("Organization", OrganizationSchema);
