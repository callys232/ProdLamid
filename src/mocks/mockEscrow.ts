// mock/mockEscrowProfile.ts
import type {
  Project,
  EscrowTransaction,
  LedgerEntry,
  Dispute,
  Wallet,
} from "@/types/project";

export const mockProjects: Project[] = [
  {
    id: "proj1",
    title: "Website Redesign",
    category: "Design",
    budget: 2000,
    ownerId: "client123",
    teamId: "freelancer456",
    adminIds: ["admin789"],
    status: "in_progress",
    currentMilestoneId: "ms1",
    currency: "USD",
    suggestedBidRange: { min: 1500, max: 2500 },
    createdAt: "2025-11-01T09:00:00Z",
    updatedAt: new Date().toISOString(),
    milestones: [
      {
        id: "ms1",
        title: "UI Mockups",
        amount: 500,
        status: "funded",
        dueDate: "2025-12-20",
        acceptanceCriteria: "Signoff on 3 screens; responsive layout",
        documents: [{ id: "doc-wf-1", name: "wireframes.pdf", url: "/mockdocs/wireframes.pdf", uploadedAt: "2025-11-20" }],
      },
      {
        id: "ms2",
        title: "Frontend Implementation",
        amount: 1500,
        status: "pending",
        dueDate: "2026-01-15",
        acceptanceCriteria: "Functional React app; unit tests",
        documents: [],
      },
    ],
    escrow: [], // populated from transactions below in runtime or by helper
    activities: [
      { id: "a1", timestamp: "2025-11-01T09:05:00Z", user: "client123", action: "created", details: "Project created" },
    ],
    tags: ["redesign", "ux"],
  },

  {
    id: "proj2",
    title: "Mobile App Development",
    category: "Development",
    budget: 5000,
    ownerId: "client123",
    teamId: "freelancer888",
    adminIds: ["admin777"],
    status: "pending",
    currentMilestoneId: "ms3",
    currency: "USD",
    suggestedBidRange: { min: 4500, max: 6000 },
    createdAt: "2025-12-01T10:00:00Z",
    updatedAt: new Date().toISOString(),
    milestones: [
      {
        id: "ms3",
        title: "Backend API",
        amount: 2500,
        status: "pending",
        dueDate: "2026-02-01",
        acceptanceCriteria: "Endpoints documented; Postman collection",
        documents: [],
      },
    ],
    escrow: [],
    activities: [],
    tags: ["mobile", "api"],
  },

  {
    id: "proj3",
    title: "Shared CRM Upgrade",
    category: "Development",
    budget: 10000,
    ownerId: "client123",
    teamId: "teamAlpha",
    adminIds: ["admin001"],
    status: "in_progress",
    currentMilestoneId: "m7",
    currency: "USD",
    suggestedBidRange: { min: 9000, max: 12000 },
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: new Date().toISOString(),
    milestones: [
      { id: "m7", title: "Requirements Gathering", amount: 2000, status: "completed", dueDate: "2026-04-15", acceptanceCriteria: "Signed requirements doc", documents: [] },
      { id: "m8", title: "System Integration", amount: 5000, status: "in_progress", dueDate: "2026-05-30", acceptanceCriteria: "Integration tests pass", documents: [] },
      { id: "m9", title: "Final Deployment", amount: 3000, status: "pending", dueDate: "2026-06-30", acceptanceCriteria: "Production release", documents: [] },
    ],
    escrow: [],
    activities: [],
    tags: ["crm", "integration"],
  },
];

export const mockTransactions: EscrowTransaction[] = [
  {
    id: "tx1",
    projectId: "proj1",
    milestoneId: "ms1",
    amount: 500,
    currency: "USD",
    payerId: "client123",
    payeeId: "escrow_account",
    status: "funded",
    type: "deposit",
    receiptUrl: "/receipts/tx1.pdf",
    fee: 10,
    netAmount: 490,
    createdAt: "2026-02-15T10:00:00Z",
    updatedAt: "2026-02-15T10:00:00Z",
    action: "Funded milestone 1",
    metadata: { paymentMethod: "card", cardLast4: "4242" },
    approvals: [], // approvals required for release
    scheduledRelease: null,
    timeLockUntil: null,
    exchangeRate: { base: "USD", target: "NGN", rate: 820.5 },
  },

  {
    id: "tx2",
    projectId: "proj2",
    milestoneId: "ms3",
    amount: 300,
    currency: "USD",
    payerId: "client123",
    payeeId: "freelancer888",
    status: "released",
    type: "release",
    receiptUrl: "/receipts/tx2.pdf",
    fee: 6,
    netAmount: 294,
    createdAt: "2026-03-01T12:00:00Z",
    updatedAt: "2026-03-02T09:00:00Z",
    action: "Released milestone 3",
    metadata: { method: "bank_transfer" },
    approvals: [{ id: "ap1", approverId: "admin777", approvedAt: "2026-03-01T11:50:00Z" }],
    scheduledRelease: null,
    timeLockUntil: null,
    exchangeRate: { base: "USD", target: "EUR", rate: 0.92 },
  },

  {
    id: "tx3",
    projectId: "proj2",
    milestoneId: "ms3",
    amount: 3000,
    currency: "USD",
    payerId: "client123",
    payeeId: "escrow_account",
    status: "funded",
    type: "deposit",
    receiptUrl: "/receipts/tx3.pdf",
    fee: 30,
    netAmount: 2970,
    createdAt: "2026-03-25T08:00:00Z",
    updatedAt: "2026-03-25T08:00:00Z",
    action: "Funded milestone 4 (demo)",
    metadata: { paymentMethod: "bank" },
    approvals: [],
    scheduledRelease: "2026-04-01T00:00:00Z", // scheduled release example
    timeLockUntil: null,
    exchangeRate: { base: "USD", target: "NGN", rate: 820.5 },
  },

  {
    id: "tx4",
    projectId: "proj3",
    milestoneId: "m7",
    amount: 2000,
    currency: "USD",
    payerId: "client123",
    payeeId: "escrow_account",
    status: "released",
    type: "release",
    receiptUrl: "/receipts/tx4.pdf",
    fee: 40,
    netAmount: 1960,
    createdAt: "2026-04-16T09:00:00Z",
    updatedAt: "2026-04-16T09:00:00Z",
    action: "Released m7",
    metadata: { method: "card" },
    approvals: [{ id: "ap2", approverId: "admin001", approvedAt: "2026-04-16T08:50:00Z" }],
    scheduledRelease: null,
    timeLockUntil: null,
    exchangeRate: { base: "USD", target: "USD", rate: 1 },
  },

  // demo pending dispute transaction
  {
    id: "tx5",
    projectId: "proj1",
    milestoneId: "ms2",
    amount: 1500,
    currency: "USD",
    payerId: "client123",
    payeeId: "escrow_account",
    status: "disputed",
    type: "deposit",
    receiptUrl: "/receipts/tx5.pdf",
    fee: 30,
    netAmount: 1470,
    createdAt: "2026-05-01T10:00:00Z",
    updatedAt: "2026-05-02T11:00:00Z",
    action: "Funded ms2 (disputed)",
    metadata: { paymentMethod: "card" },
    approvals: [],
    scheduledRelease: null,
    timeLockUntil: null,
    exchangeRate: { base: "USD", target: "NGN", rate: 820.5 },
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
    type: "debit",
    reference: "tx1",
    createdAt: new Date().toISOString(),
    notes: "Client funded milestone ms1",
  },
  {
    id: "ledger2",
    userId: "freelancer456",
    projectId: "proj1",
    currency: "USD",
    amount: 300,
    debitAccount: "escrow_wallet",
    creditAccount: "freelancer_wallet",
    type: "credit",
    reference: "tx2",
    createdAt: new Date().toISOString(),
    notes: "Released to freelancer",
  },
  {
    id: "ledger3",
    userId: "client123",
    projectId: "proj2",
    currency: "USD",
    amount: 3000,
    debitAccount: "client_wallet",
    creditAccount: "escrow_wallet",
    type: "debit",
    reference: "tx3",
    createdAt: new Date().toISOString(),
    notes: "Scheduled deposit for ms3",
  },
];

/* -------------------- MOCK DISPUTES -------------------- */
export const mockDisputes: Dispute[] = [
  {
    id: "dispute1",
    projectId: "proj1",
    milestoneId: "ms1",
    openedBy: "freelancer456",
    openedByRole: "freelancer",
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: ["Client delayed release", "Requested additional QA evidence"],
    evidence: [
      { id: "ev1", name: "screenshot.png", url: "/mockdocs/ev1.png", uploadedAt: "2026-04-20T12:00:00Z" },
    ],
    assignedTo: "dispute_officer_1",
    slaDueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days
    resolution: null,
    outcome: null,
  },
];

/* -------------------- MOCK WALLETS -------------------- */
export const mockWallets: Wallet[] = [
  {
    id: "wallet1",
    userId: "client123",
    currency: "USD",
    availableBalance: 1500,
    heldBalance: 500,
    totalBalance: 2000,
    status: "active",
    kycStatus: "verified",
    riskScore: 12, // 0-100 low->high
    lastKycAt: "2026-01-10T09:00:00Z",
    updatedAt: new Date().toISOString(),
    metadata: { provider: "stripe", accountRef: "acct_123" },
  },
  {
    id: "wallet2",
    userId: "freelancer456",
    currency: "USD",
    availableBalance: 300,
    heldBalance: 0,
    totalBalance: 300,
    status: "active",
    kycStatus: "verified",
    riskScore: 8,
    lastKycAt: "2026-02-01T09:00:00Z",
    updatedAt: new Date().toISOString(),
    metadata: { provider: "stripe", accountRef: "acct_456" },
  },
];

/* -------------------- ESCROW SUMMARY (aggregates) -------------------- */
export const mockEscrowSummary = {
  totalByCurrency: { USD: 8000, NGN: 0, EUR: 0 },
  availableForRelease: { USD: 3000, NGN: 0, EUR: 0 },
  pendingDisputes: mockDisputes.length,
  heldByProject: mockProjects.reduce((acc: Record<string, number>, p) => {
    const sum = mockTransactions.filter((t) => t.projectId === p.id && t.status !== "released").reduce((s, t) => s + t.amount, 0);
    acc[p.id] = sum;
    return acc;
  }, {}),
  lastUpdated: new Date().toISOString(),
};



export function attachEscrowToProjects() {
  mockProjects.forEach((p) => {
    // @ts-ignore - projects may have escrow typed differently; ensure types align in your project types
    p.escrow = mockTransactions.filter((t) => t.projectId === p.id);
  });
}
