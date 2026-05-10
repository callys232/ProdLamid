// mocks/mockConciergeProjects.ts

export interface ConciergeMilestone {
  id: string;
  title: string;
  status: "completed" | "in_progress" | "disputed" | "funded" | "pending" | "cancelled";
  progress: number;
  dueDate: string;
  description?: string;
  disputeReason?: string;
}

export interface ConciergeConsultant {
  name: string;
  role: string;
}

export interface ConciergeActivityItem {
  text: string;
  time: string;
  type: "success" | "info" | "warning" | "dispute";
}

export interface ConciergeProject {
  id: string;
  title: string;
  status: "active" | "completed" | "review" | "paused";
  budget: number;
  spent: number;
  progress: number;
  pm: string;
  deadline: string;
  category: string;
  description: string;
  skills: string[];
  consultants: ConciergeConsultant[];
  milestones: ConciergeMilestone[];
  activity: ConciergeActivityItem[];
}

export const mockConciergeProjects: ConciergeProject[] = [
  {
    id: "concierge-proj-001",
    title: "UNDP Community Health Programme",
    status: "active",
    budget: 85000,
    spent: 52000,
    progress: 68,
    pm: "Dr. A. Okafor",
    deadline: "Aug 2026",
    category: "Public Health",
    description:
      "Strengthening community health systems across 6 states through capacity building, infrastructure support, and digital health monitoring. The programme targets 1.2 million beneficiaries and partners with state ministries of health.",
    skills: ["Public Health", "Programme Management", "M&E", "Digital Health", "Stakeholder Engagement"],
    consultants: [
      { name: "Dr. Amaka Okafor",  role: "Lead Consultant"          },
      { name: "Ngozi Adeyemi",     role: "Health Systems Specialist" },
      { name: "Emeka Obi",         role: "M&E Officer"               },
    ],
    milestones: [
      { id: "m1", title: "Baseline Assessment & Needs Analysis",      status: "completed",   progress: 100, dueDate: "2026-02-28", description: "Comprehensive baseline survey across all 6 states." },
      { id: "m2", title: "Stakeholder Engagement & Governance Setup", status: "completed",   progress: 100, dueDate: "2026-03-31" },
      { id: "m3", title: "Phase 1 Training Rollout — 3 States",       status: "in_progress", progress: 68,  dueDate: "2026-06-30", description: "Health worker training across Kano, Kaduna and Sokoto." },
      { id: "m4", title: "Digital Monitoring System Deployment",      status: "funded",      progress: 20,  dueDate: "2026-07-31" },
      { id: "m5", title: "Mid-Term Evaluation & Reporting",           status: "pending",     progress: 0,   dueDate: "2026-09-30" },
      { id: "m6", title: "Phase 2 Training — Remaining States",       status: "pending",     progress: 0,   dueDate: "2026-11-30" },
    ],
    activity: [
      { text: "Phase 1 training completed in Kano State — 340 health workers certified", time: "2 days ago",  type: "success" },
      { text: "PM weekly check-in completed — progress on track",                         time: "5 days ago",  type: "info"    },
      { text: "Milestone 3 funding confirmed — $18,000 released to escrow",               time: "1 week ago",  type: "success" },
      { text: "Vendor contract for digital monitoring system signed",                     time: "2 weeks ago", type: "info"    },
      { text: "Milestone 2 approved and marked complete",                                 time: "3 weeks ago", type: "success" },
    ],
  },
  {
    id: "concierge-proj-002",
    title: "Federal Ministry HR Transformation",
    status: "active",
    budget: 120000,
    spent: 38000,
    progress: 35,
    pm: "Ms. T. Williams",
    deadline: "Dec 2026",
    category: "Human Resources",
    description:
      "End-to-end HR modernisation for the Federal Ministry of Labour and Employment, covering policy reform, HRIS procurement and deployment, and capacity building for 2,000+ civil servants across 12 departments.",
    skills: ["HR Strategy", "Change Management", "HRIS Implementation", "Policy Reform", "Training & Development"],
    consultants: [
      { name: "Temi Williams",  role: "Lead HR Consultant" },
      { name: "Bayo Adewale",   role: "HRIS Specialist"    },
      { name: "Chioma Nwosu",   role: "Change Manager"      },
    ],
    milestones: [
      { id: "m1", title: "HR Audit & Gap Analysis",             status: "completed",   progress: 100, dueDate: "2026-03-15" },
      { id: "m2", title: "Policy Framework Design",             status: "in_progress", progress: 60,  dueDate: "2026-05-31" },
      { id: "m3", title: "HRIS Vendor Selection & Procurement", status: "disputed",    progress: 0,   dueDate: "2026-07-31", disputeReason: "Vendor failed to meet agreed technical specifications in the RFP. Mediation initiated. Estimated resolution: 3–4 weeks." },
      { id: "m4", title: "System Configuration & Piloting",     status: "pending",     progress: 0,   dueDate: "2026-09-30" },
      { id: "m5", title: "National Rollout & Staff Training",   status: "pending",     progress: 0,   dueDate: "2026-12-15" },
    ],
    activity: [
      { text: "Dispute raised on Milestone 3 — mediation team notified",  time: "3 days ago",  type: "dispute" },
      { text: "Policy Framework draft submitted for Ministry review",      time: "1 week ago",  type: "info"    },
      { text: "PM escalation call held with Ministry stakeholders",        time: "10 days ago", type: "warning" },
      { text: "HR Audit approved — Milestone 1 marked complete",          time: "3 weeks ago", type: "success" },
    ],
  },
  {
    id: "concierge-proj-003",
    title: "NGO Digital Capacity Building",
    status: "completed",
    budget: 45000,
    spent: 44200,
    progress: 100,
    pm: "Mr. B. Adeyemi",
    deadline: "Apr 2026",
    category: "Digital Transformation",
    description:
      "Digital skills programme delivered to 15 NGO partners across Lagos and Abuja, covering data management, programme reporting tools, and cybersecurity fundamentals. All objectives achieved ahead of schedule.",
    skills: ["Digital Training", "Data Management", "Reporting Tools", "Cybersecurity Basics"],
    consultants: [
      { name: "Biodun Adeyemi", role: "Lead Trainer"        },
      { name: "Sola Fashola",   role: "Curriculum Designer"  },
    ],
    milestones: [
      { id: "m1", title: "Needs Assessment",             status: "completed", progress: 100, dueDate: "2026-01-15" },
      { id: "m2", title: "Curriculum Design",            status: "completed", progress: 100, dueDate: "2026-02-15" },
      { id: "m3", title: "Training Delivery — 15 NGOs", status: "completed", progress: 100, dueDate: "2026-03-31" },
      { id: "m4", title: "Post-Training Assessment",     status: "completed", progress: 100, dueDate: "2026-04-15" },
    ],
    activity: [
      { text: "Project closed — all milestones completed and approved", time: "2 weeks ago", type: "success" },
      { text: "Final impact report submitted to client",                time: "3 weeks ago", type: "success" },
      { text: "Post-training assessment: 94% satisfaction rate",        time: "1 month ago", type: "success" },
    ],
  },
  {
    id: "concierge-proj-004",
    title: "Gender Equality Initiative — Lagos",
    status: "review",
    budget: 62000,
    spent: 54000,
    progress: 90,
    pm: "Dr. A. Okafor",
    deadline: "Jun 2026",
    category: "Social Impact",
    description:
      "Gender mainstreaming programme targeting economic inclusion and advocacy across Lagos State agencies. Focus areas include policy integration, capacity building, and measurable impact reporting for international funders.",
    skills: ["Gender Policy", "Advocacy", "Research & Analysis", "Impact Measurement"],
    consultants: [
      { name: "Dr. Amaka Okafor", role: "Lead Consultant"  },
      { name: "Yetunde Bello",    role: "Gender Specialist" },
    ],
    milestones: [
      { id: "m1", title: "Research & Data Collection",       status: "completed",   progress: 100, dueDate: "2026-01-31" },
      { id: "m2", title: "Policy Brief Development",         status: "completed",   progress: 100, dueDate: "2026-02-28" },
      { id: "m3", title: "Stakeholder Advocacy Campaign",    status: "completed",   progress: 100, dueDate: "2026-04-30" },
      { id: "m4", title: "Final Evaluation & Impact Report", status: "in_progress", progress: 70,  dueDate: "2026-06-15" },
    ],
    activity: [
      { text: "Final impact report draft submitted — awaiting PM review", time: "1 day ago",   type: "info"    },
      { text: "Advocacy campaign concluded — 8 agencies engaged",         time: "1 week ago",  type: "success" },
      { text: "International funder mid-term review: all KPIs on track",  time: "2 weeks ago", type: "success" },
      { text: "Milestone 3 approved — funds released",                    time: "1 month ago", type: "success" },
    ],
  },
];
