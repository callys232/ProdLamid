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

  // ── Availability ────────────────────────────────────────────
  openToWork:          { type: Boolean, default: false },
  availabilityStatus:  {
    type: String,
    enum: ["available", "partially_available", "unavailable"],
    default: "available",
  },
  availableFrom:       { type: Date },
  hoursPerWeek:        { type: Number, min: 0, max: 80 },
});

ProfileSchema.index({ user: 1 }, { unique: true });
ProfileSchema.index({ industry: 1 });
ProfileSchema.index({ rating: -1 });
ProfileSchema.index({ 'availability': 1 });

export const Profile =
  mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
