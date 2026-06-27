import mongoose, { Schema } from "mongoose";

const PointsTransactionSchema = new Schema({
  type:        { type: String, enum: ["credit", "debit"], required: true },
  amount:      { type: Number, required: true },
  description: { type: String, required: true },
  reference:   { type: String },
  createdAt:   { type: Date, default: Date.now },
}, { _id: true });

const PointsSchema = new Schema({
  userId:       { type: Schema.Types.ObjectId, ref: "Users", required: true, unique: true },
  balance:      { type: Number, default: 0, min: 0 },
  transactions: [PointsTransactionSchema],
}, { timestamps: true });

export const Points =
  mongoose.models.Points || mongoose.model("Points", PointsSchema);
