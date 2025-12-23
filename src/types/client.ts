// types/client.ts
import { Project, Milestone } from "./project";

/* -------------------- CONSULTANTS -------------------- */
export interface Consultant {
  id: string;
  _id?: string;
  name: string;
  industry: string;
  delivery: string;
  rate: string | number;
  rating: number;
  role: string;

  image?: string;
  email?: string;
  experience?: number;
  skills?: string[];

  projects?: Project[];
}

/* -------------------- ESCROW TRANSACTIONS -------------------- */
export interface EscrowTransaction {
  id: string;
  _id?: string;
  projectId: string;
  amount: number;
  currency: string;
  status:
    | "pending"
    | "funded"
    | "released"
    | "cancelled"
    | "disputed"
    | "completed";

  createdAt: string;
  updatedAt: string;

  releaseDate?: string;
  notes?: string;

  milestoneId?: string;
  milestones?: Milestone[];
}

/* -------------------- INVITATIONS -------------------- */
export interface Invitation {
  id: string;
  _id?: string;

  invitedBy?: string;
  projectId?: string;
  email?: string;
  consultantId?: string;

  method: "email" | "consultant" | "ai";
  status: "pending" | "accepted" | "declined";

  createdAt: string;
}

/* -------------------- TEAM MEMBERS -------------------- */
export interface TeamMember {
  id: string;
  _id?: string;

  name: string;
  role: string;
  email: string;
  addedAt: string;

  projects?: Project[];
}

/* -------------------- AI LOGS -------------------- */
export interface AiActionLog {
  id: string;
  _id?: string;

  actionType:
    | "onboarding"
    | "project-scoping"
    | "matching"
    | "notification"
    | "marketing"
    | "support";

  message: string;
  createdAt: string;

  relatedProjectId?: string;
  relatedConsultantId?: string;
}

/* -------------------- AI PREFERENCES -------------------- */
export interface AiPreferences {
  tone?: "formal" | "neutral" | "friendly" | "technical";
  automationLevel?: "manual" | "assist" | "auto";
  onboardingCompleted?: boolean;
  industryKeywords?: string[];
  aiAssistantEnabled?: boolean;
}

/* -------------------- BUSINESS PROFILE -------------------- */
export interface BusinessProfile {
  companyName?: string;
  _id?: string;
  industry?: string;
  location?: string;
  size?: "1-10" | "11-50" | "51-200" | "200+";
  website?: string;
}

/* -------------------- ALERTS -------------------- */
export interface Alert {
  id: string;
  type:
    | "Broadcast"
    | "escrow"
    | "payment"
    | "milestone"
    | "message"
    | "Email"
    | "Slack"
    | "Sms"
    | "Risk"
    | "document"
    | "complaint";

  message: string;

  channel?: string;
  severity?: "Low" | "Medium" | "High";
  createdAt?: string;
}

/* -------------------- NOTIFICATIONS -------------------- */
export interface Notification {
  id: number;
  message: string;
  createdAt?: string;

  type:
    | "Broadcast"
    | "escrow"
    | "payment"
    | "milestone"
    | "message"
    | "Email"
    | "Slack"
    | "Sms"
    | "Risk"
    | "document"
    | "complaint";

  severity?: "Low" | "Medium" | "High";
}

/* -------------------- CLIENT PROFILE -------------------- */
export interface ClientProfile {
  id: string;
  _id?: string;
  name: string;
  email: string;
  username: string | number;

  business?: BusinessProfile;
  ai?: AiPreferences;

  projects: Project[];
  consultants: Consultant[];
  escrowTransactions: EscrowTransaction[];
  invitations: Invitation[];
  teamMembers: TeamMember[];
  aiLogs?: AiActionLog[];

  createdAt: string;
  updatedAt: string;

  companyname?: string;
  bio?: string;
  isPremium?: boolean;
  avatar?: string;
  location?: string;
  industry?: string;
  balance?: number;

  alerts: Alert[];
  notifications: Notification[];

  suggestedBidRange?: { min: number; max: number };
}
