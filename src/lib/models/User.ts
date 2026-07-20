import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const UserSchema = new mongoose.Schema({
  uuid: {
    type: String, required: true, unique: true, default: uuidv4,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  username: { type: String, unique: true },
  phoneNumber: { type: String, },
  isVerified: { type: Boolean, default: false },
  accountDeleted: { type: Boolean, default: false },
  verificationCode: { type: String },
  refreshTokenJTI: { type: String, default: null },
  googleId: { type: String, unique: true, sparse: true },
  role: {
    type: String, enum: ["admin", "seller", "client"], default: "client"
  },
  joinedAt: { type: Date, default: Date.now },

  // Security
  twoFAEnabled: { type: Boolean, default: false },
  twoFASecret: { type: String },
  twoFAMethod: { type: String, enum: ["email", "google"], default: "email" },

  // Subscription / tier
  tier:               { type: String, enum: ["free", "premium", "enterprise", "enterprise_plus"], default: "free" },
  subscriptionId:     { type: String, default: null },    // Paystack subscription code
  subscriptionStatus: { type: String, enum: ["active", "inactive", "cancelled", "non-renewing"], default: "inactive" },
  subscriptionCycle:  { type: String, enum: ["monthly", "quarterly", "annual"], default: "monthly" },

  // Enterprise org membership
  orgId:   { type: mongoose.Schema.Types.ObjectId, ref: "Organization", default: null },
  orgRole: { type: String, enum: ["org_admin", "org_manager", "org_member", "org_viewer"], default: null },

  // Password reset
  resetToken:       { type: String, default: null },
  resetTokenExpiry: { type: Date,   default: null },

  // KYC
  kycStatus:    { type: String, enum: ["not_submitted", "pending", "approved", "rejected"], default: "not_submitted" },
  kycDocuments: [{ type: String }],

  // Notification preferences
  notificationPrefs: {
    emailNotifications: { type: Boolean, default: true },
    projectUpdates:     { type: Boolean, default: true },
    messages:           { type: Boolean, default: true },
    billing:            { type: Boolean, default: true },
  },

  // Account type — resolves to the correct dashboard
  accountType: {
    type: String,
    enum: ["Client", "Freelancer", "Enterprise", "Concierge", "Admin", "Engine"],
    default: null,
  },

  // Account status (active / suspended / deleted)
  status: {
    type: String,
    enum: ["active", "suspended", "deleted"],
    default: "active",
  },
  isDeleted: { type: Boolean, default: false },

  // Concierge tier request
  conciergeRequest: {
    status:       { type: String, enum: ["pending", "approved", "rejected"], default: undefined },
    organisation: { type: String },
    orgType:      { type: String },
    description:  { type: String },
    submittedAt:  { type: Date },
    reviewedAt:   { type: Date },
    notes:        { type: String },
  },

  // Account deletion request
  deletionRequest: {
    requested:   { type: Boolean, default: false },
    reason:      { type: String },
    requestedAt: { type: Date },
    resolvedAt:  { type: Date },
    status:      { type: String, enum: ["pending", "approved", "rejected"] },
  },
}, {
  timestamps: true,
  strictPopulate: false
});
UserSchema.virtual("profile", {
  ref: "Profile",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

UserSchema.virtual("businessProfile", {
  ref: "BusinessProfile",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

UserSchema.virtual("paymentInfo", {
  ref: "PaymentInfo",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

UserSchema.virtual("addresses", {
  ref: "Address",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

// Enable virtuals in outputs
UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });

// ── Indexes ────────────────────────────────────────────────────
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ tier: 1 });
UserSchema.index({ kycStatus: 1 });
UserSchema.index({ orgId: 1 });
// text index for admin search
UserSchema.index({ username: "text", email: "text" });

// Delete cached model so schema changes (new fields) take effect on hot-reload in dev.
if (process.env.NODE_ENV !== "production" && mongoose.models.Users) {
  delete (mongoose.models as any).Users;
}

export const Users = mongoose.models.Users || mongoose.model("Users", UserSchema);
