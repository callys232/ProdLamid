import mongoose from "mongoose";

export interface IFinanceSignal {
  severity: "High" | "Medium" | "Low";
  title: string;
  action: string;
}

export interface IFinanceProgress {
  label: string;
  value: number;
}

export interface IFinanceDashboard extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  orgId?: mongoose.Schema.Types.ObjectId;

  // KPI scores (0–100)
  revenueHealth: number;
  marginScore: number;
  cashFlowClarity: number;
  enterpriseValue: number;

  // Live signal feed
  financialSignals: IFinanceSignal[];

  // Health progress bars
  budgetProgress: IFinanceProgress[];

  updatedAt: Date;
}

const signalSchema = new mongoose.Schema<IFinanceSignal>(
  {
    severity: { type: String, enum: ["High", "Medium", "Low"], required: true },
    title:    { type: String, required: true },
    action:   { type: String, required: true },
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema<IFinanceProgress>(
  {
    label: { type: String, required: true },
    value: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
);

const FinanceDashboardSchema = new mongoose.Schema<IFinanceDashboard>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    orgId:  { type: mongoose.Schema.Types.ObjectId, ref: "Organization", default: null },

    revenueHealth:   { type: Number, default: 0, min: 0, max: 100 },
    marginScore:     { type: Number, default: 0, min: 0, max: 100 },
    cashFlowClarity: { type: Number, default: 0, min: 0, max: 100 },
    enterpriseValue: { type: Number, default: 0, min: 0, max: 100 },

    financialSignals: { type: [signalSchema], default: [] },
    budgetProgress:   { type: [progressSchema], default: [] },
  },
  { timestamps: true }
);

export const FinanceDashboard =
  mongoose.models.FinanceDashboard ||
  mongoose.model<IFinanceDashboard>("FinanceDashboard", FinanceDashboardSchema);
