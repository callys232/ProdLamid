import mongoose, { Schema } from "mongoose";

const PermissionsSchema = new Schema({
  canPostProjects:    { type: Boolean, default: false },
  canHireConsultants: { type: Boolean, default: false },
  canViewBilling:     { type: Boolean, default: false },
  canManageMembers:   { type: Boolean, default: false },
  canViewAnalytics:   { type: Boolean, default: true },
}, { _id: false });

const DEFAULT_PERMISSIONS: Record<string, object> = {
  org_admin:   { canPostProjects: true, canHireConsultants: true, canViewBilling: true, canManageMembers: true, canViewAnalytics: true },
  org_manager: { canPostProjects: true, canHireConsultants: true, canViewBilling: false, canManageMembers: false, canViewAnalytics: true },
  org_member:  { canPostProjects: true, canHireConsultants: false, canViewBilling: false, canManageMembers: false, canViewAnalytics: true },
  org_viewer:  { canPostProjects: false, canHireConsultants: false, canViewBilling: false, canManageMembers: false, canViewAnalytics: true },
};

export { DEFAULT_PERMISSIONS };

const OrgMemberSchema = new Schema({
  orgId:       { type: Schema.Types.ObjectId, ref: "Organization", required: true },
  userId:      { type: Schema.Types.ObjectId, ref: "Users", default: null },
  role:        { type: String, enum: ["org_admin", "org_manager", "org_member", "org_viewer"], required: true },
  invitedBy:   { type: Schema.Types.ObjectId, ref: "Users" },
  inviteEmail: { type: String, lowercase: true, trim: true },
  inviteToken: { type: String },
  status:      { type: String, enum: ["active", "pending", "suspended"], default: "pending" },
  joinedAt:    { type: Date },
  permissions: { type: PermissionsSchema, default: () => ({}) },
}, { timestamps: true });

OrgMemberSchema.index({ orgId: 1, userId: 1 }, { unique: true, sparse: true });
OrgMemberSchema.index({ inviteToken: 1 }, { sparse: true });

export const OrgMember =
  mongoose.models.OrgMember ||
  mongoose.model("OrgMember", OrgMemberSchema);
