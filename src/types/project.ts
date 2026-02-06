import { Consultant } from "./client";

/* -------------------- PROJECT -------------------- */
export interface Project {
  _id?: string;
  id: string;

  title: string;
  category: string;
  tech?: string;
  location?: string;
  budget?: number;
  hourlyRate?: number;
  rating?: number;
  organization?: string;
  image?: string;
  images?: string[];
  description?: string;

  /* 🔹 NEW: Client-facing project meaning */
  purpose?: string;
  color?: string; // hex color for branding (e.g. "#c12129")

  /* 🔹 NEW: Capability-driven representation */
  skills?: string[];

  /* 🔹 NEW: Execution structure */
  workPhases?: WorkPhase[];

  milestones?: Milestone[];

  // type?: "fixed" | "hourly";
  type?: number;

  adminIds?: string[];
  currentMilestoneId?: string;

  suggestedBidRange?: {
    min: number;
    max: number;
  };

  /* 🔹 Existing + compatible */
  consultants?: string[] | Consultant[];

  /* 🔹 NEW: Project-scoped consultant assignments */
  assignedConsultants?: ProjectConsultant[];

  priority?: string;
  deadline?: string;
  status?: string;

  teamId?: string;
  ownerId?: string;

  milestoneProgress?: number;
  timeline?: string;

  escrow?: EscrowTransaction[];
  activities?: ActivityItem[];
}

/* -------------------- WORK PHASES -------------------- */
export interface WorkPhase {
  id?: string;
  name: string;
  duration: string; // e.g. "2 weeks", "4 weeks"
  description?: string;
  order?: number;
  status?: "pending" | "active" | "completed";
}

/* -------------------- PROJECT CONSULTANT -------------------- */
export interface ProjectConsultant {
  id: string;
  consultantId?: string; // links to Consultant entity
  name: string;
  role: string;
  schedule: string; // "Mon–Fri, 9am–5pm"
  progress: number; // 0–100
  assignedAt?: string;
  status?: "active" | "paused" | "completed";
}

/* -------------------- MILESTONES -------------------- */
export type MilestoneStatus =
  | "pending"
  | "in_progress"
  | "funded"
  | "released"
  | "completed"
  | "cancelled"
  | "disputed";

export interface Milestone {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  amount?: number;
  dueDate?: string;
  progress?: number;
  status?: MilestoneStatus;
  deadline?: string;
  workPhaseId?: string;
}

/* -------------------- ACTIVITY LOG -------------------- */
export interface ActivityItem {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
  type?: "system" | "user";
}

/* -------------------- ESCROW -------------------- */
export type EscrowStatus = "pending" | "funded" | "released" | "completed" | "failed" | "disputed";

export interface EscrowTransaction {
  id: string;
  projectId: string;
  milestoneId?: string;
  amount: number;
  currency: string;
  status: EscrowStatus;
  createdAt: string;
  updatedAt: string;
  date?: string;
  type?: string;
  action?: string;
}

/* -------------------- WALLET -------------------- */
export interface Wallet {
  id: string;
  userId: string;
  currency: string;
  availableBalance: number;
  heldBalance: number;
  status: "active" | "frozen" | "closed";
  updatedAt: string;
}

/* -------------------- LEDGER -------------------- */
export interface LedgerEntry {
  id: string;
  userId: string;
  projectId?: string;
  currency: string;
  amount: number;
  debitAccount: string;
  creditAccount: string;
  referenceId?: string;
  createdAt: string;
}

/* -------------------- DISPUTES -------------------- */
export type DisputeStatus = "open" | "under_review" | "resolved" | "closed";

export interface Dispute {
  id: string;
  projectId: string;
  milestoneId?: string;
  openedBy: string;
  status: DisputeStatus;
  resolution?: "refund" | "release" | "split";
  resolutionRatio?: number;
  evidenceRefs?: string[];
  notes?: string[];
  createdAt: string;
  updatedAt: string;
}

/* -------------------- ESCROW DASHBOARD -------------------- */
export interface EscrowDashboardProps {
  balance: number;
  fundedTotal: number;
  releasedTotal: number;
  transactions: EscrowTransaction[];
  ledger: LedgerEntry[];
  project: Project;
  currentUserId: string;
}
