/** Project archetypes the budget engine can scaffold. */
export const PROJECT_TYPES = [
  "Software / IT Build",
  "Construction & Civil Works",
  "Marketing Campaign",
  "Event / Conference",
  "Product Launch",
  "Research & Development",
  "Consulting Engagement",
  "Training & Capability Programme",
  "Infrastructure & Facilities",
  "Grant / Donor Programme",
  "Manufacturing Run",
  "Custom / Other",
] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

/** Standard cost groupings. Kept generic so any project type maps onto them. */
export const COST_CATEGORIES = [
  "Personnel",
  "Contractors & Professional Fees",
  "Equipment & Hardware",
  "Software & Licences",
  "Materials & Supplies",
  "Facilities & Logistics",
  "Travel & Accommodation",
  "Marketing & Communications",
  "Training & Development",
  "Compliance & Insurance",
  "Other Direct Costs",
] as const;
export type CostCategory = (typeof COST_CATEGORIES)[number];

export interface LineItem {
  id:        string;
  category:  CostCategory;
  name:      string;
  notes?:    string;
  quantity:  number;
  unit:      string;   // "hours", "days", "units", "months", "sqm", "lump sum"
  unitCost:  number;
  /** Optional 1-based period this cost lands in, for phasing. */
  period?:   number;
}

export interface BudgetSettings {
  projectName:   string;
  projectType:   ProjectType;
  currency:      string;   // ISO 4217
  periods:       number;   // number of months/phases
  periodLabel:   string;   // "Month" | "Quarter" | "Phase"
  overheadPct:   number;   // % of direct costs
  contingencyPct:number;   // % of (direct + overhead)
  taxPct:        number;   // % applied to taxable base
  taxOnOverhead: boolean;
}

export interface CategoryRollup {
  category:  CostCategory;
  subtotal:  number;
  pctOfDirect: number;
  itemCount: number;
}

export interface BudgetTotals {
  directCosts:  number;
  overhead:     number;
  contingency:  number;
  taxableBase:  number;
  tax:          number;
  grandTotal:   number;
}

export interface PeriodBreakdown {
  period: number;
  label:  string;
  direct: number;
  /** Overhead/contingency/tax spread pro-rata against this period's direct spend. */
  loaded: number;
}

export interface ComputedBudget {
  settings:    BudgetSettings;
  lineItems:   LineItem[];
  categories:  CategoryRollup[];
  totals:      BudgetTotals;
  periods:     PeriodBreakdown[];
  /** Non-blocking data-quality warnings surfaced to the user. */
  warnings:    string[];
}
