// mocks/mockEnterpriseBilling.ts

export type InvoiceStatus  = "paid" | "pending" | "failed";
export type BillingCycle   = "monthly" | "quarterly" | "annual";

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
  cycle: BillingCycle;
}

export const mockInvoices: Invoice[] = [
  { id: "INV-0041", date: "2026-04-01", amount: 18500, status: "paid",    cycle: "monthly" },
  { id: "INV-0040", date: "2026-03-01", amount: 18500, status: "paid",    cycle: "monthly" },
  { id: "INV-0039", date: "2026-02-01", amount: 18500, status: "paid",    cycle: "monthly" },
  { id: "INV-0038", date: "2026-01-01", amount: 18500, status: "pending", cycle: "monthly" },
];

export const enterpriseFeatures = [
  "Up to 50 team members",
  "Up to 12 active projects",
  "Milestone escrow management",
  "Executive analytics dashboard",
  "Custom contract templates",
  "Priority 48hr deployment SLA",
  "24/7 support via Slack",
];

export const enterprisePlusFeatures = [
  "100+ team members (custom scaling)",
  "Unlimited active projects",
  "White-label portal",
  "Dedicated account director",
  "Emergency 6hr staffing SLA",
  "Custom API integrations",
  "Quarterly strategy reviews",
];

export const enterprisePrices: Record<BillingCycle, number> = {
  monthly:   18500,
  quarterly: 52500,
  annual:    200000,
};

export const enterpriseSavings: Partial<Record<BillingCycle, string>> = {
  quarterly: "Save $3,000 vs monthly",
  annual:    "Save $22,000",
};

export const perLabel: Record<BillingCycle, string> = {
  monthly:   "/mo",
  quarterly: "/qtr",
  annual:    "/yr",
};
