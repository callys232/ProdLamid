import type {
  Project,
  EscrowTransaction,
  LedgerEntry,
  Dispute,
  Wallet,
} from "@/types/project";

/* -------------------- MOCK PROJECTS -------------------- */
export const mockProjects: Project[] = [
  {
    id: "proj1",
    title: "Website Redesign",
    category: "Design",
    budget: 2000,
    ownerId: "client123", // ✅ matches default logged‑in user
    teamId: "freelancer456",
    adminIds: ["admin789"],
    status: "in_progress",
    currentMilestoneId: "ms1",
    milestones: [
      {
        id: "ms1",
        title: "UI Mockups",
        amount: 500,
        status: "funded",
        dueDate: "2025-12-20",
      },
      {
        id: "ms2",
        title: "Frontend Implementation",
        amount: 1500,
        status: "pending",
        dueDate: "2026-01-15",
      },
    ],
    escrow: [],
    activities: [],
  },
  {
    id: "proj2",
    title: "Mobile App Development",
    category: "Development",
    budget: 5000,
    ownerId: "client123", // ✅ adjusted to match logged‑in user
    teamId: "freelancer888",
    adminIds: ["admin777"],
    status: "pending",
    currentMilestoneId: "ms3",
    milestones: [
      {
        id: "ms3",
        title: "Backend API",
        amount: 2500,
        status: "pending",
        dueDate: "2026-02-01",
      },
    ],
    escrow: [],
    activities: [],
  },
];

/* -------------------- MOCK ESCROW TRANSACTIONS -------------------- */
export const mockTransactions: EscrowTransaction[] = [
  {
    id: "tx1",
    projectId: "proj1",
    milestoneId: "ms1",
    amount: 500,
    currency: "USD",
    status: "funded",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    action: "Funded milestone 1",
  },
  {
    id: "tx2",
    projectId: "proj2",
    milestoneId: "ms3",
    amount: 300,
    currency: "USD",
    status: "released",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    action: "Released milestone 3",
  },
];

/* -------------------- MOCK LEDGER ENTRIES -------------------- */
export const mockLedger: LedgerEntry[] = [
  {
    id: "ledger1",
    userId: "client123",
    projectId: "proj1",
    currency: "USD",
    amount: 500,
    debitAccount: "client_wallet",
    creditAccount: "escrow_wallet",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ledger2",
    userId: "freelancer456",
    projectId: "proj1",
    currency: "USD",
    amount: 300,
    debitAccount: "escrow_wallet",
    creditAccount: "freelancer_wallet",
    createdAt: new Date().toISOString(),
  },
];

/* -------------------- MOCK DISPUTES -------------------- */
export const mockDisputes: Dispute[] = [
  {
    id: "dispute1",
    projectId: "proj1",
    milestoneId: "ms1",
    openedBy: "freelancer456",
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: ["Client delayed release"],
  },
];

/* -------------------- MOCK WALLETS -------------------- */
export const mockWallets: Wallet[] = [
  {
    id: "wallet1",
    userId: "client123", // ✅ logged‑in user wallet
    currency: "USD",
    availableBalance: 1500,
    heldBalance: 500,
    status: "active",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "wallet2",
    userId: "freelancer456",
    currency: "USD",
    availableBalance: 300,
    heldBalance: 0,
    status: "active",
    updatedAt: new Date().toISOString(),
  },
];
