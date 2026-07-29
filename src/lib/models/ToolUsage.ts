import mongoose, { Schema } from "mongoose";

/**
 * One record per intelligence-module run by a signed-in member.
 * Visitors are never recorded — the gate blocks results before a run completes.
 */
const ToolUsageSchema = new Schema({
  userId:           { type: Schema.Types.ObjectId, ref: "Users", required: true, index: true },
  moduleId:         { type: String, required: true },   // e.g. "C03"
  engineName:       { type: String, required: true },   // e.g. "Diagnostic Engine"
  seriesName:       { type: String },                   // e.g. "C-Series"
  organisationName: { type: String },                   // what they assessed
  href:             { type: String },                   // route back to the tool
  runAt:            { type: Date, default: Date.now },

  /* The generated assessment, stored so members can reopen a past run and
     compare scores over time. Mixed because result shape varies by module. */
  result:           { type: Schema.Types.Mixed },
  /** Dimension scores flattened for trend queries without loading full results. */
  scores:           [{ label: String, value: Number, _id: false }],

  /* What was fed in, so a run can be repeated next quarter without retyping
     it. Shape varies by archetype, hence Mixed. */
  inputs:           { type: Schema.Types.Mixed },
}, { timestamps: true });

// History is always "this user's runs, newest first"
ToolUsageSchema.index({ userId: 1, runAt: -1 });

export const ToolUsage =
  mongoose.models.ToolUsage || mongoose.model("ToolUsage", ToolUsageSchema);
