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

/* -------------------- PROJECTS (WITH MULTIPLE FREELANCERS) -------------------- */
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
    consultants: ["c1", "c2", "c3"], // MULTIPLE FREELANCERS
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
    consultants: ["c2", "c4"], // MULTIPLE FREELANCERS
    milestoneProgress: 100,
    image: "https://placehold.co/600x400?text=Team+Beta",
    suggestedBidRange: { min: 7000, max: 9000 },
  },
  /* single-freelancer team project */
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
    consultants: ["c3"], // SINGLE FREELANCER
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
    consultants: ["c1", "c3"], // MULTIPLE FREELANCERS
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
    rating: 4.0,
    organization: "Independent",
    status: "completed",
    priority: "Low",
    deadline: "2025-09-01",
    ownerId: "client2",
    milestones: exampleMilestones.slice(0, 1),
    consultants: ["c2"], // SINGLE FREELANCER
    milestoneProgress: 100,
    image: "https://placehold.co/600x400?text=Delta",
    suggestedBidRange: { min: 800, max: 1200 },
  },
  /* optional: unassigned project (zero freelancers) */
  {
    _id: "ip3",
    id: "ip3",
    title: "Unassigned Marketing Landing Page",
    category: "Web",
    tech: "Next.js, Tailwind",
    location: "Remote",
    budget: 1500,
    hourlyRate: 30,
    rating: 0,
    organization: "Independent",
    status: "open",
    priority: "Medium",
    deadline: "2025-07-21",
    ownerId: "client2",
    milestones: exampleMilestones.slice(0, 1),
    consultants: [], // NO FREELANCERS
    milestoneProgress: 0,
    image: "https://placehold.co/600x400?text=Landing+Page",
    suggestedBidRange: { min: 1200, max: 1800 },
  },
];

/* -------------------- CONSULTANTS (EXPANDED FOR MULTI-FREELANCER PROJECTS) -------------------- */
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
    projects: [individualProjects[0], teamProjects[0]],
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
    projects: [individualProjects[1], teamProjects[1]],
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
  {
    id: "e2",
    projectId: "tp2",
    amount: 1200,
    currency: "USD",
    status: "funded",
    createdAt: oneHourAgo,
    updatedAt: now,
    milestoneId: "m2",
  },
  {
    id: "e3",
    projectId: "ip1",
    amount: 300,
    currency: "USD",
    status: "pending",
    createdAt: twoHoursAgo,
    updatedAt: now,
    milestoneId: "m3",
  },
];

/* -------------------- ACTIVITY LOG -------------------- */
export const mockActivity: ActivityItem[] = [
  {
    id: "1",
    action: "Bid Placed",
    user: "Consultant A",
    timestamp: now,
    details: "Proposed $2500 with 3-week delivery",
  },
  {
    id: "2",
    action: "Milestone Updated",
    user: "Project Owner",
    timestamp: oneHourAgo,
    details: "Design phase marked complete",
  },
  {
    id: "3",
    action: "Escrow Released",
    user: "System",
    timestamp: twoHoursAgo,
    details: "Payment of $500 released for milestone m1",
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
    alerts: [
      {
        id: "a1",
        type: "Risk",
        message: "Milestone overdue",
        severity: "High",
      } as Alert,
    ],
    notifications: [
      {
        id: 1,
        type: "Email",
        message: "Reminder: Team sync at 3 PM",
      } as Notification,
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "client2",
    username: "alicej",
    name: "Alice Johnson",
    email: "alice@example.com",
    companyname: "Example LLC",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    isPremium: false,
    projects: [...teamProjects, ...individualProjects],
    consultants: mockConsultants,
    teamMembers: mockTeamMembers,
    escrowTransactions: [],
    invitations: [],
    teams: [],
    aiLogs: [],
    alerts: [
      {
        id: "a1",
        type: "message",
        message: "Milestone in progress",
        severity: "High",
      } as Alert,
    ],
    notifications: [
      {
        id: 1,
        type: "Email",
        message: "Reminder: upload at 3 PM",
      } as Notification,
    ],
    createdAt: now,
    updatedAt: now,
  },
];

/* -------------------- ACTIVE CLIENT -------------------- */
export const activeClient = mockClients[0];
