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
  milestones?: Milestone[];
  // type?: "fixed" | "hourly";
  type?: number;
  adminIds?: string[];
  currentMilestoneId?: string;
  suggestedBidRange?: {
    min: number;
    max: number;
  };

  consultants?: string[] | Consultant[];

  priority?: string;
  deadline?: string;
  status?: string;

  teamId?: string;
  ownerId?: string;

  milestoneProgress?: number;
  timeline?: string;
  skills?: string[];
  escrow?: EscrowTransaction[];
  activities?: ActivityItem[];
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
}

/* -------------------- ACTIVITY LOG -------------------- */
export interface ActivityItem {
  id: string; // unique identifier
  action: string; // e.g. "Bid Placed", "Milestone Updated"
  user: string; // who performed the action
  timestamp: string; // ISO date string
  details?: string; // optional extra info
  type?: "system" | "user";
}

/* -------------------- ESCROW -------------------- */
export type EscrowStatus = "pending" | "funded" | "released" | "failed";

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
  action?: string; // descriptive action
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
  resolutionRatio?: number; // e.g. 0.5 for 50/50 split
  evidenceRefs?: string[];
  notes?: string[];
  createdAt: string;
  updatedAt: string;
}

// types/project.ts
export interface EscrowDashboardProps {
  balance: number;
  fundedTotal: number;
  releasedTotal: number;
  transactions: EscrowTransaction[];
  ledger: LedgerEntry[];
  project: Project;
  currentUserId: string;
}
