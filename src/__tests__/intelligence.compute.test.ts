import { describe, it, expect } from "vitest";
import { computeBudget, lineTotal } from "@/lib/budget/compute";
import type { LineItem, BudgetSettings } from "@/lib/budget/types";
import { computeFinancials } from "@/lib/intelligence/financial";
import { computeRoster } from "@/lib/intelligence/roster";
import { computeScenarios } from "@/lib/intelligence/scenario";
import { computeSeriesStats } from "@/lib/intelligence/inputSpec";

/* ── Archetype D — budget ─────────────────────────────────── */
describe("computeBudget", () => {
  const settings: BudgetSettings = {
    projectName: "Test", projectType: "Software / IT Build", currency: "USD",
    periods: 2, periodLabel: "Month",
    overheadPct: 10, contingencyPct: 10, taxPct: 10, taxOnOverhead: false,
  };
  const items: LineItem[] = [
    { id: "1", category: "Personnel", name: "Engineer", quantity: 2, unit: "months", unitCost: 5000, period: 1 },
    { id: "2", category: "Software & Licences", name: "Tooling", quantity: 1, unit: "lump sum", unitCost: 1000, period: 2 },
  ];

  it("computes the loaded cost stack in the correct order", () => {
    const b = computeBudget(items, settings);
    expect(b.totals.directCosts).toBe(11000);        // 10000 + 1000
    expect(b.totals.overhead).toBe(1100);            // 10% of direct
    expect(b.totals.contingency).toBe(1210);         // 10% of (direct + overhead)
    expect(b.totals.tax).toBe(1221);                 // 10% of (direct + contingency)
    expect(b.totals.grandTotal).toBe(14531);
  });

  it("excludes overhead from tax when taxOnOverhead is false", () => {
    const withOh = computeBudget(items, { ...settings, taxOnOverhead: true });
    expect(withOh.totals.taxableBase).toBeGreaterThan(computeBudget(items, settings).totals.taxableBase);
  });

  it("phases costs into the period each item declares", () => {
    const b = computeBudget(items, settings);
    expect(b.periods[0].direct).toBe(10000);
    expect(b.periods[1].direct).toBe(1000);
  });

  it("spreads unphased items evenly across periods", () => {
    const b = computeBudget([{ ...items[0], period: undefined }], settings);
    expect(b.periods[0].direct).toBe(b.periods[1].direct);
  });

  it("is deterministic — identical inputs give identical output", () => {
    expect(computeBudget(items, settings).totals).toEqual(computeBudget(items, settings).totals);
  });

  it("warns when contingency is zero", () => {
    const b = computeBudget(items, { ...settings, contingencyPct: 0 });
    expect(b.warnings.some((w) => w.toLowerCase().includes("contingency"))).toBe(true);
  });

  it("ignores negative quantities rather than producing negative totals", () => {
    expect(lineTotal({ ...items[0], quantity: -5 })).toBe(0);
  });
});

/* ── Archetype C — financial ──────────────────────────────── */
describe("computeFinancials", () => {
  const base = {
    currency: "USD", periodLabel: "Month", cashBalance: 100000, headcount: 10,
    periods: [
      { revenue: 100000, cogs: 40000, opex: 50000 },
      { revenue: 120000, cogs: 48000, opex: 55000 },
    ],
  };

  it("derives margins from the period lines", () => {
    const s = computeFinancials(base);
    expect(s.totalRevenue).toBe(220000);
    expect(s.grossProfit).toBe(132000);              // 220000 - 88000
    expect(s.grossMarginPct).toBe(60);
    expect(s.operatingProfit).toBe(27000);           // 132000 - 105000
  });

  it("returns null runway when operating profitably", () => {
    expect(computeFinancials(base).runwayPeriods).toBeNull();
  });

  it("computes runway only when burning cash", () => {
    const burning = computeFinancials({
      ...base,
      periods: [{ revenue: 10000, cogs: 5000, opex: 30000 }],
    });
    expect(burning.netBurnPerPeriod).toBeLessThan(0);
    expect(burning.runwayPeriods).toBeGreaterThan(0);
  });

  it("flags a thin gross margin", () => {
    const thin = computeFinancials({
      ...base, periods: [{ revenue: 100000, cogs: 90000, opex: 5000 }],
    });
    expect(thin.warnings.some((w) => w.includes("Gross margin"))).toBe(true);
  });

  it("does not divide by zero on empty revenue", () => {
    const s = computeFinancials({ ...base, periods: [{ revenue: 0, cogs: 0, opex: 0 }] });
    expect(Number.isFinite(s.grossMarginPct)).toBe(true);
    expect(s.grossMarginPct).toBe(0);
  });
});

/* ── Archetype E — roster ─────────────────────────────────── */
describe("computeRoster", () => {
  const rows = [
    { id: "1", role: "Lead",    headcount: 2,  capability: 5, attritionRisk: 1, successors: 1, critical: true  },
    { id: "2", role: "Manager", headcount: 18, capability: 2, attritionRisk: 5, successors: 2, critical: false },
    { id: "3", role: "CFO",     headcount: 1,  capability: 4, attritionRisk: 3, successors: 0, critical: true  },
  ];

  it("weights capability by headcount, not by role count", () => {
    const s = computeRoster(rows);
    expect(s.meanCapability).toBeCloseTo(3.7, 1);     // unweighted
    expect(s.weightedCapability).toBeLessThan(s.meanCapability); // large weak team drags it down
  });

  it("identifies critical roles with no successor", () => {
    expect(computeRoster(rows).singlePointRoles).toEqual(["CFO"]);
  });

  it("computes headcount at risk from high-attrition roles", () => {
    const s = computeRoster(rows);
    expect(s.headcountAtRisk).toBe(18);
    expect(s.atRiskPct).toBeCloseTo(85.7, 0);
  });

  it("handles an empty roster without dividing by zero", () => {
    const s = computeRoster([]);
    expect(s.totalHeadcount).toBe(0);
    expect(s.warnings.length).toBeGreaterThan(0);
  });
});

/* ── Archetype F — scenario ───────────────────────────────── */
describe("computeScenarios", () => {
  const opts = [
    { id: "a", name: "Build",   probability: 60, upside: 500000, downside: 200000, cost: 150000, horizon: 12 },
    { id: "b", name: "Partner", probability: 55, upside: 250000, downside:  60000, cost:  50000, horizon: 3  },
  ];

  it("computes expected value as p*upside - (1-p)*downside", () => {
    const s = computeScenarios(opts);
    const build = s.options.find((o) => o.name === "Build")!;
    expect(build.expectedValue).toBe(220000);        // 0.6*500000 - 0.4*200000
    expect(build.netExpected).toBe(70000);           // less 150000 cost
  });

  it("ranks options by net expected value", () => {
    expect(computeScenarios(opts).best!.name).toBe("Build");
  });

  it("identifies the narrowest risk spread separately from the best value", () => {
    const s = computeScenarios(opts);
    expect(s.safest!.name).toBe("Partner");
    expect(s.hasTradeoff).toBe(true);
  });

  it("warns when every option is value-negative", () => {
    const s = computeScenarios([{ ...opts[0], upside: 1000, cost: 500000 }]);
    expect(s.warnings.some((w) => w.includes("negative expected value"))).toBe(true);
  });

  it("clamps probability outside 0-100", () => {
    const s = computeScenarios([{ ...opts[0], probability: 250 }]);
    expect(s.options[0].probability).toBe(100);
  });
});

/* ── Archetype B — time series ────────────────────────────── */
describe("computeSeriesStats", () => {
  const metric = { key: "k", label: "Cycle time", unit: " days" };

  it("classifies a rising series", () => {
    const s = computeSeriesStats(metric, [10, 11, 12, 13]);
    expect(s.trend).toBe("rising");
    expect(s.changePct).toBe(30);
  });

  it("classifies a falling series", () => {
    expect(computeSeriesStats(metric, [20, 18, 16, 14]).trend).toBe("falling");
  });

  it("prioritises volatility over direction", () => {
    // Ends higher than it started, but swings wildly in between.
    expect(computeSeriesStats(metric, [10, 90, 20, 80, 30, 95]).trend).toBe("volatile");
  });

  it("handles an empty series without NaN", () => {
    const s = computeSeriesStats(metric, []);
    expect(s.mean).toBe(0);
    expect(Number.isFinite(s.changePct)).toBe(true);
  });
});
