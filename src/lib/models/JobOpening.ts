import mongoose, { Schema } from "mongoose";

const SalaryRangeSchema = new Schema(
  {
    min:      { type: Number },
    max:      { type: Number },
    currency: { type: String, default: "USD" },
  },
  { _id: false }
);

const JobOpeningSchema = new Schema(
  {
    title:      { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    track: {
      type: String,
      enum: [
        "Leadership Development",
        "Project Management",
        "Sales Enablement",
        "Digital Transformation",
        "General",
      ],
      default: "General",
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "freelance", "internship"],
      default: "full-time",
    },
    delivery: {
      type:    String,
      enum:    ["Remote", "Onsite", "Hybrid"],
      default: "Remote",
    },
    location:       { type: String, trim: true },
    description:    { type: String, trim: true },
    requirements:   { type: [String], default: [] },
    skills:         { type: [String], default: [] },
    salaryRange:    { type: SalaryRangeSchema },
    status: {
      type:    String,
      enum:    ["open", "paused", "closed"],
      default: "open",
    },
    postedBy:       { type: Schema.Types.ObjectId, ref: "Users", required: true },
    orgId:          { type: Schema.Types.ObjectId, ref: "Organization" },
    applicantCount: { type: Number, default: 0, min: 0 },
    deadline:       { type: Date },
  },
  { timestamps: true }
);

JobOpeningSchema.index({ status: 1, createdAt: -1 });
JobOpeningSchema.index({ track: 1, status: 1 });
JobOpeningSchema.index({ postedBy: 1 });

delete (mongoose.models as Record<string, unknown>).JobOpening;
export const JobOpening =
  mongoose.models.JobOpening ||
  mongoose.model("JobOpening", JobOpeningSchema);
