import mongoose, { Schema } from "mongoose";

const StageHistorySchema = new Schema(
  {
    stage:   { type: String, required: true },
    movedAt: { type: Date, default: Date.now },
    movedBy: { type: Schema.Types.ObjectId, ref: "Users" },
    notes:   { type: String },
  },
  { _id: false }
);

const InternalNoteSchema = new Schema(
  {
    content:   { type: String, required: true },
    author:    { type: Schema.Types.ObjectId, ref: "Users" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const CandidateSchema = new Schema(
  {
    fullName:       { type: String, required: true, trim: true },
    email:          { type: String, required: true, trim: true, lowercase: true },
    phone:          { type: String, trim: true },
    country:        { type: String, trim: true },
    linkedIn:       { type: String, trim: true },
    currentRole:    { type: String, trim: true },
    yearsExperience:{ type: Number, min: 0 },
    industry:       { type: String, trim: true },
    skills:         { type: [String], default: [] },
    cvUrl:          { type: String },
    motivation:     { type: String },
    comments:       { type: String },
    source: {
      type:    String,
      enum:    ["talent_club", "recruitment_form", "direct", "referral"],
      default: "direct",
    },
    jobOpeningId: { type: Schema.Types.ObjectId, ref: "JobOpening" },
    userId:       { type: Schema.Types.ObjectId, ref: "Users" },
    matchScore:   { type: Number, default: 0, min: 0, max: 100 },
    pipelineStage: {
      type:    String,
      enum:    ["applied", "screening", "interview", "offer", "hired", "rejected", "withdrawn"],
      default: "applied",
    },
    stageHistory:  { type: [StageHistorySchema], default: [] },
    assignedTo:    { type: Schema.Types.ObjectId, ref: "Users" },
    internalNotes: { type: [InternalNoteSchema], default: [] },
    status: {
      type:    String,
      enum:    ["active", "archived"],
      default: "active",
    },
  },
  { timestamps: true }
);

CandidateSchema.index({ jobOpeningId: 1, pipelineStage: 1 });
CandidateSchema.index({ email: 1 });
CandidateSchema.index({ pipelineStage: 1, createdAt: -1 });
CandidateSchema.index({ status: 1 });

delete (mongoose.models as Record<string, unknown>).Candidate;
export const Candidate =
  mongoose.models.Candidate ||
  mongoose.model("Candidate", CandidateSchema);
