export type EscrowStatus =
  | "pending"
  | "funded"
  | "in_progress"
  | "released"
  | "completed"
  | "disputed";

export interface Milestone {
  id: string;
  title: string;
  progress: number;
  status: EscrowStatus;
}

export interface Message {
  id: string;
  sender: "client" | "consultant" | "admin";
  content: string;
  timestamp: string;
  createdAt: string;
  balance: number;
}

export interface Escrow {
  id: string;
  balance: number;
  status: EscrowStatus;
  milestones: Milestone[];
  messages?: Message[];
  teamNumber?: string;
  amountPaid?: number;
  projectFund?: number;
  projectDuration?: string;
  milestone?: string;
  documents?: ProjectDocument[];
}
export interface ProjectDocument {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}
