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

  skills: { type: [String], default: [] },
});

export const Profile =
  mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
