import mongoose from "mongoose";

/**
 * A course or certification a user completed on an external platform.
 *
 * Learning happens in the LMS; this ecosystem needs it to reason about
 * capability — career path readiness, succession, capability gaps. Until now
 * none of it crossed back, so the career path tool had to ask users to retype
 * what the LMS already knew.
 *
 * Records are pushed here by the LMS after completion. `externalId` is the
 * platform's own id for the enrolment and makes the write idempotent: a
 * retried or replayed callback updates one row rather than adding a duplicate.
 */
const LearningRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true, index: true },

  /** Which platform reported this. Only "lms" today; kept open for others. */
  source:     { type: String, enum: ["lms", "docushare", "manual"], default: "lms" },
  /** The source platform's identifier for this enrolment. */
  externalId: { type: String, required: true },

  title:       { type: String, required: true, trim: true },
  provider:    { type: String, trim: true },
  /** Skills this course evidences — what the capability tools read. */
  skills:      { type: [String], default: [] },
  hours:       { type: Number, default: 0, min: 0 },
  certified:   { type: Boolean, default: false },
  credentialUrl: { type: String },

  /** 0–100 where the platform reports partial progress. */
  progressPct: { type: Number, default: 100, min: 0, max: 100 },
  status:      { type: String, enum: ["in_progress", "completed", "expired"], default: "completed" },

  startedAt:   { type: Date },
  completedAt: { type: Date },
  /** When this ecosystem last heard about it. */
  syncedAt:    { type: Date, default: Date.now },
}, { timestamps: true });

/* One row per enrolment per source. The upsert key — this is what stops a
   replayed callback from inflating someone's record. */
LearningRecordSchema.index({ userId: 1, source: 1, externalId: 1 }, { unique: true });
LearningRecordSchema.index({ userId: 1, completedAt: -1 });

export const LearningRecord =
  mongoose.models.LearningRecord || mongoose.model("LearningRecord", LearningRecordSchema);
export { LearningRecordSchema };
