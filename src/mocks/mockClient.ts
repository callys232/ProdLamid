// mocks/mockClient.ts

import {
  ClientProfile,
  Consultant,
  TeamMember,
  EscrowTransaction,
  Invitation,
  AiActionLog,
  Alert,
  Notification,
} from "@/types/client";

import { Project, Milestone, ActivityItem } from "@/types/project";

/* -------------------- TIMESTAMP CONSTANTS -------------------- */

const now = new Date().toISOString();
const oneHourAgo = new Date(Date.now() - 3600 * 1000).toISOString();
const twoHoursAgo = new Date(Date.now() - 7200 * 1000).toISOString();

/* -------------------- MILESTONES -------------------- */

export const exampleMilestones: Milestone[] = [
  {
    id: "m1",
    title: "Design Phase",
    description: "UI/UX design and prototype creation",
    progress: 100,
    status: "completed",
  },
  {
    id: "m2",
    title: "Development Phase",
    description: "Frontend and backend development",
    progress: 50,
    status: "in_progress",
  },
  {
    id: "m3",
    title: "Testing & QA",
    description: "Final testing and client feedback integration",
    progress: 0,
    status: "pending",
  },
];

/* -------------------- PROJECTS -------------------- */

export const teamProjects: Project[] = [
  {
    _id: "tp1",
    id: "tp1",
    title: "Team Project Alpha",
    category: "Web",
    tech: "React.js, Node.js",
    location: "Remote",
    budget: 5000,
    hourlyRate: 50,
    rating: 4.5,
    organization: "Fallback Corp",
    status: "ongoing",
    priority: "High",
    deadline: "2025-12-31",
    teamId: "team1",
    ownerId: "client1",
    milestones: exampleMilestones,
    milestoneProgress: 60,
    image: "https://placehold.co/600x400?text=Team+Alpha",
    suggestedBidRange: { min: 4000, max: 6000 },
  },
  {
    _id: "tp2",
    id: "tp2",
    title: "Team Project Beta",
    category: "Mobile",
    tech: "Flutter",
    location: "Onsite",
    budget: 8000,
    hourlyRate: 70,
    rating: 4.8,
    organization: "Fallback Corp",
    status: "completed",
    priority: "Medium",
    deadline: "2025-10-15",
    teamId: "team1",
    ownerId: "client1",
    milestones: exampleMilestones.slice(0, 2),
    milestoneProgress: 100,
    image: "https://placehold.co/600x400?text=Team+Beta",
    suggestedBidRange: { min: 7000, max: 9000 },
  },
  {
    _id: "tp3",
    id: "tp3",
    title: "Team Project Omega",
    category: "Backend",
    tech: "Node.js, PostgreSQL",
    location: "Hybrid",
    budget: 3500,
    hourlyRate: 45,
    rating: 4.6,
    organization: "Fallback Corp",
    status: "ongoing",
    priority: "Low",
    deadline: "2025-08-15",
    teamId: "team1",
    ownerId: "client1",
    milestones: exampleMilestones.slice(0, 1),
    milestoneProgress: 20,
    image: "https://placehold.co/600x400?text=Team+Omega",
    suggestedBidRange: { min: 3000, max: 4000 },
  },
];

export const individualProjects: Project[] = [
  {
    _id: "ip1",
    id: "ip1",
    title: "Individual Project Gamma",
    category: "AI",
    tech: "Python, FastAPI",
    location: "Remote",
    budget: 2000,
    hourlyRate: 40,
    rating: 4.2,
    organization: "Independent",
    status: "ongoing",
    priority: "High",
    deadline: "2025-11-30",
    ownerId: "client2",
    milestones: exampleMilestones,
    milestoneProgress: 30,
    image: "https://placehold.co/600x400?text=Gamma",
    suggestedBidRange: { min: 1800, max: 2500 },
  },
  {
    _id: "ip2",
    id: "ip2",
    title: "Individual Project Delta",
    category: "Design",
    tech: "Figma",
    location: "Hybrid",
    budget: 1000,
    hourlyRate: 25,
    rating: 4,
    organization: "Independent",
    status: "completed",
    priority: "Low",
    deadline: "2025-09-01",
    ownerId: "client2",
    milestones: exampleMilestones.slice(0, 1),
    milestoneProgress: 100,
    image: "https://placehold.co/600x400?text=Delta",
    suggestedBidRange: { min: 800, max: 1200 },
  },
];

/* -------------------- CONSULTANTS -------------------- */

export const mockConsultants: Consultant[] = [
  {
    id: "c1",
    name: "Jane Smith",
    industry: "Technology",
    delivery: "Remote",
    rate: "$50/hr",
    rating: 4.7,
    role: "Lead Developer",
    email: "jane@example.com",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    projects: [teamProjects[0], individualProjects[0]],
    skills: ["React.js", "Python", "UI/UX"],
  },
  {
    id: "c2",
    name: "Bob Brown",
    industry: "Finance",
    delivery: "Onsite",
    rate: "$60/hr",
    rating: 4.5,
    role: "Financial Consultant",
    email: "bob@example.com",
    image: "https://randomuser.me/api/portraits/men/70.jpg",
    projects: [teamProjects[1], individualProjects[1]],
    skills: ["Flutter", "Figma", "Financial Analysis"],
  },
  {
    id: "c3",
    name: "Omar Johnson",
    industry: "AI",
    delivery: "Remote",
    rate: "$80/hr",
    rating: 4.9,
    role: "Machine Learning Engineer",
    email: "omar@example.com",
    image: "https://randomuser.me/api/portraits/men/85.jpg",
    projects: [teamProjects[0], individualProjects[0]],
    skills: ["TensorFlow", "PyTorch", "Deep Learning"],
  },
  {
    id: "c4",
    name: "Linda Green",
    industry: "Mobile",
    delivery: "Hybrid",
    rate: "$55/hr",
    rating: 4.6,
    role: "Mobile Developer",
    email: "linda@example.com",
    image: "https://randomuser.me/api/portraits/women/48.jpg",
    projects: [teamProjects[1]],
    skills: ["Flutter", "Dart", "UI/UX Mobile"],
  },
];

/* -------------------- TEAM MEMBERS -------------------- */

export const mockTeamMembers: TeamMember[] = [
  {
    id: "t1",
    name: "Alice Cooper",
    role: "Project Manager",
    email: "alice@example.com",
    addedAt: now,
    projects: [teamProjects[0]],
  },
  {
    id: "t2",
    name: "David Kim",
    role: "UI Designer",
    email: "david@example.com",
    addedAt: now,
    projects: [teamProjects[1]],
  },
];

/* -------------------- ESCROW TRANSACTIONS -------------------- */

export const mockEscrowTransactions: EscrowTransaction[] = [
  {
    id: "e1",
    projectId: "tp1",
    amount: 500,
    currency: "USD",
    status: "released",
    createdAt: now,
    updatedAt: now,
    milestoneId: "m1",
  },
];

/* -------------------- ACTIVITY LOG -------------------- */

export const mockActivity: ActivityItem[] = [
  {
    id: "1",
    action: "Bid Placed",
    user: "Consultant A",
    timestamp: now,
  },
];

/* -------------------- INVITATIONS -------------------- */

export const mockInvitations: Invitation[] = [
  {
    id: "i1",
    invitedBy: "client1",
    consultantId: "c1",
    method: "consultant",
    status: "pending",
    createdAt: now,
  },
];

/* -------------------- AI LOGS -------------------- */

export const mockAiLogs: AiActionLog[] = [
  {
    id: "log1",
    actionType: "matching",
    message: "AI matched consultant Jane Smith to Project Gamma.",
    createdAt: now,
    relatedProjectId: "ip1",
    relatedConsultantId: "c1",
  },
];

/* -------------------- CLIENTS -------------------- */

export const mockClients: ClientProfile[] = [
  {
    id: "client1",
    username: "CatalForc",
    name: "Caleb",
    email: "techbuddie@example.com",
    companyname: "Fallback Corp",
    avatar: "https://randomuser.me/api/portraits/black/72.jpg",
    bio: "Tech enthusiast building solutions with AI and web automation.",
    isPremium: true,
    projects: [...teamProjects, ...individualProjects],
    consultants: mockConsultants,
    teamMembers: mockTeamMembers,
    escrowTransactions: mockEscrowTransactions,
    invitations: mockInvitations,
    teams: [],
    aiLogs: mockAiLogs,
    alerts: [],
    notifications: [],
    createdAt: now,
    updatedAt: now,
  },
];

/* -------------------- ACTIVE CLIENT -------------------- */

export const activeClient = mockClients[0];