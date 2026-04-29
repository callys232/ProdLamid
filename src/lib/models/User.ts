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

  // Enterprise org membership
  orgId:   { type: mongoose.Schema.Types.ObjectId, ref: "Organization", default: null },
  orgRole: { type: String, enum: ["org_admin", "org_manager", "org_member", "org_viewer"], default: null },

  // Password reset
  resetToken:       { type: String, default: null },
  resetTokenExpiry: { type: Date,   default: null },
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

export const Users = mongoose.models.Users || mongoose.model("Users", UserSchema);
