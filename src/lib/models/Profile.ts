import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  profilePicture: {
    type: String,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  firstName: { type: String },
  lastName: { type: String },

  // Consultant specific fields
  industry: { type: String },
  rate: { type: Number }, // Hourly rate
  rating: { type: Number, default: 0 },
  delivery: { type: String, enum: ["Remote", "Onsite", "Hybrid"] },
  title: { type: String }, // e.g. "Full Stack Developer"
  skills: { type: [String], default: [] },

  addresses: [
    {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
      country: { type: String },
      isDefault: { type: Boolean, default: false },
    }
  ],

  // Payment Information
  walletAddress: { type: String },
  network: { type: String },
  bankAccount: { type: String },
  routingNumber: { type: String },
  bankName: { type: String },

  // Business Profile
  companyName: { type: String },
  companySize: { type: String },
  website: { type: String },
  description: { type: String },

  // Resume
  resumeUrl: { type: String },
});

export const Profile =
  mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
