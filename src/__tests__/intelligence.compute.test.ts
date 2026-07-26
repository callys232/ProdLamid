import { describe, it, expect } from "vitest";
import { computeBudget, lineTotal } from "@/lib/budget/compute";
import type { LineItem, BudgetSettings } from "@/lib/budget/types";
import { computeFinancials } from "@/lib/intelligence/financial";
import { computeRoster } from "@/lib/intelligence/roster";
import { computeScenarios } from "@/lib/intelligence/scenario";
import { computeSeriesStats } from "@/lib/intelligence/inputSpec";
import {
  rosterDimensions, financialDimensions, seriesDimensions,
  scenarioDimensions, budgetDimensions,
} from "@/lib/intelligence/dimensions";

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
  const metric = { key: "k", label: "Cycle time", unit: " days", betterWhen: "lower" as const };

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

/* ── Upgrades: target attainment ──────────────────────────── */
describe("computeSeriesStats — targets", () => {
  const lower = { key: "cycle", label: "Cycle time", unit: " days", betterWhen: "lower" as const, target: 10 };
  const higher = { key: "otr", label: "On-time rate", unit: "%", betterWhen: "higher" as const, target: 85 };

  it("scores a lower-is-better metric that beats its target at 100", () => {
    const s = computeSeriesStats(lower, [14, 12, 8]);
    expect(s.onTarget).toBe(true);
    expect(s.attainment).toBe(100); // 10/8 = 125%, capped
  });

  it("scores a lower-is-better metric that misses below 100", () => {
    const s = computeSeriesStats(lower, [14, 15, 20]);
    expect(s.onTarget).toBe(false);
    expect(s.attainment).toBe(50); // 10/20
  });

  it("scores a higher-is-better metric proportionally", () => {
    const s = computeSeriesStats(higher, [60, 65, 68]);
    expect(s.onTarget).toBe(false);
    expect(s.attainment).toBe(80); // 68/85
  });

  it("reports no attainment when no target is set", () => {
    const s = computeSeriesStats({ ...lower, target: undefined }, [10, 11], null);
    expect(s.target).toBeNull();
    expect(s.attainment).toBeNull();
    expect(s.onTarget).toBeNull();
  });

  it("treats a zero target as absent rather than dividing by it", () => {
    const s = computeSeriesStats(lower, [10, 11], 0);
    expect(s.attainment).toBeNull();
  });
});

/* ── Upgrades: scenario sensitivity ───────────────────────── */
describe("computeScenarios — sensitivity", () => {
  const opts = [
    { id: "a", name: "A", probability: 70, upside: 100, downside: 50, cost: 10, horizon: 6 },
    { id: "b", name: "B", probability: 40, upside: 200, downside: 80, cost: 20, horizon: 6 },
  ];

  it("computes a breakeven probability for the runner-up", () => {
    const s = computeScenarios(opts);
    expect(s.sensitivity).toHaveLength(1);
    const sv = s.sensitivity[0];
    expect(sv.leader).toBe(s.best!.name);
    expect(sv.breakevenPct).toBeGreaterThan(0);
    expect(sv.breakevenPct).toBeLessThanOrEqual(100);
  });

  it("puts the breakeven above the challenger's current probability", () => {
    const s = computeScenarios(opts);
    // The challenger lost, so it needs a higher probability to draw level.
    expect(s.sensitivity[0].marginPoints!).toBeGreaterThan(0);
  });

  it("flags a fragile ranking when the margin is thin", () => {
    const near = [
      { id: "a", name: "A", probability: 50, upside: 100, downside: 50, cost: 0, horizon: 6 },
      { id: "b", name: "B", probability: 49, upside: 100, downside: 50, cost: 0, horizon: 6 },
    ];
    const s = computeScenarios(near);
    expect(s.tightestMargin).not.toBeNull();
    expect(s.sensitivity[0].flipsEasily).toBe(true);
    expect(s.warnings.some((w) => w.includes("fragile"))).toBe(true);
  });

  it("returns no sensitivity for a single option", () => {
    const s = computeScenarios([opts[0]]);
    expect(s.sensitivity).toHaveLength(0);
    expect(s.tightestMargin).toBeNull();
  });
});

/* ── Upgrades: opex breakdown ─────────────────────────────── */
describe("computeFinancials — cost lines", () => {
  const base = { currency: "USD", periodLabel: "Month", cashBalance: 100000, headcount: 10 };

  it("returns no cost lines without a breakdown", () => {
    const s = computeFinancials({
      ...base,
      periods: [{ revenue: 1000, cogs: 400, opex: 400 }],
    });
    expect(s.opexLines).toHaveLength(0);
    expect(s.concentrationPct).toBe(0);
  });

  it("ranks cost lines largest first and measures concentration", () => {
    const s = computeFinancials({
      ...base,
      periods: [
        { revenue: 1000, cogs: 0, opex: 100, opexBreakdown: { "Payroll & Benefits": 70, "Marketing & Sales": 30 } },
      ],
    });
    expect(s.opexLines[0].category).toBe("Payroll & Benefits");
    expect(s.opexLines[0].pctOfOpex).toBe(70);
    expect(s.concentrationPct).toBe(70);
  });

  it("measures percentages against tracked periods only", () => {
    const s = computeFinancials({
      ...base,
      periods: [
        { revenue: 1000, cogs: 0, opex: 100, opexBreakdown: { "Payroll & Benefits": 100 } },
        { revenue: 1000, cogs: 0, opex: 100 }, // untracked
      ],
    });
    // 100 of the 100 tracked, not 100 of 200 total.
    expect(s.opexLines[0].pctOfOpex).toBe(100);
  });

  it("flags a cost line growing faster than revenue", () => {
    const s = computeFinancials({
      ...base,
      periods: [
        { revenue: 1000, cogs: 0, opex: 100, opexBreakdown: { "Software & Subscriptions": 100 } },
        { revenue: 1100, cogs: 0, opex: 300, opexBreakdown: { "Software & Subscriptions": 300 } },
      ],
    });
    expect(s.outpacingLines).toContain("Software & Subscriptions");
  });
});

/* ── Upgrades: budget variance ────────────────────────────── */
describe("computeBudget — variance", () => {
  const settings: BudgetSettings = {
    projectName: "V", projectType: "Software / IT Build", currency: "USD",
    periods: 1, periodLabel: "Month",
    overheadPct: 0, contingencyPct: 0, taxPct: 0, taxOnOverhead: false,
  };

  it("reports untracked when no actuals are entered", () => {
    const b = computeBudget(
      [{ id: "1", category: "Personnel", name: "Dev", quantity: 1, unit: "mo", unitCost: 1000 }],
      settings,
    );
    expect(b.variance.tracked).toBe(false);
    expect(b.variance.projectedTotal).toBeNull();
  });

  it("computes overrun against only the tracked lines", () => {
    const b = computeBudget(
      [
        { id: "1", category: "Personnel", name: "Dev", quantity: 1, unit: "mo", unitCost: 1000, actual: 1200 },
        { id: "2", category: "Materials & Supplies", name: "Kit", quantity: 1, unit: "ea", unitCost: 1000 },
      ],
      settings,
    );
    expect(b.variance.tracked).toBe(true);
    expect(b.variance.linesTracked).toBe(1);
    expect(b.variance.budgetedToDate).toBe(1000);
    expect(b.variance.variancePct).toBe(20);
    expect(b.variance.overruns[0].name).toBe("Dev");
  });

  it("does not treat an untracked line as zero spent", () => {
    const b = computeBudget(
      [
        { id: "1", category: "Personnel", name: "Dev", quantity: 1, unit: "mo", unitCost: 1000, actual: 1000 },
        { id: "2", category: "Materials & Supplies", name: "Kit", quantity: 1, unit: "ea", unitCost: 9000 },
      ],
      settings,
    );
    // On plan for what is tracked — the untracked 9000 must not read as a 90% underspend.
    expect(b.variance.variancePct).toBe(0);
  });

  it("withholds a projection until enough of the budget is tracked", () => {
    const b = computeBudget(
      [
        { id: "1", category: "Personnel", name: "Small", quantity: 1, unit: "ea", unitCost: 100, actual: 150 },
        { id: "2", category: "Materials & Supplies", name: "Large", quantity: 1, unit: "ea", unitCost: 9900 },
      ],
      settings,
    );
    expect(b.variance.projectedTotal).toBeNull(); // only 1% tracked
  });
});

/* ── Upgrades: dimensions derived from compute, never from the model ── */
describe("dimension derivation", () => {
  it("derives roster dimensions from the roster summary", () => {
    const s = computeRoster([
      { id: "1", role: "Lead", headcount: 2, capability: 5, attritionRisk: 1, successors: 1, critical: true },
      { id: "2", role: "CFO",  headcount: 1, capability: 4, attritionRisk: 5, successors: 0, critical: true },
    ]);
    const d = rosterDimensions(s);
    expect(d).toHaveLength(4);
    // Bench coverage: 1 of 2 critical roles has a successor.
    expect(d.find((x) => x.label === "Bench Coverage")!.value).toBe(50);
    // The insight must quote the computed figure, not invent one.
    expect(d.find((x) => x.label === "Bench Coverage")!.insight).toContain("CFO".slice(0, 0) + "1 of 2");
  });

  it("derives financial dimensions and clamps a loss to zero", () => {
    const s = computeFinancials({
      currency: "USD", periodLabel: "Month", cashBalance: 1000, headcount: 1,
      periods: [{ revenue: 100, cogs: 40, opex: 200 }],
    });
    const d = financialDimensions(s);
    expect(d).toHaveLength(4);
    expect(d[0].value).toBe(60);              // 60% gross margin
    expect(d[1].value).toBe(0);               // operating loss floors at 0
    expect(d[1].insight).toContain("loss");   // the sign survives in the text
  });

  it("scores series dimensions on attainment when a target exists", () => {
    const stats = [
      computeSeriesStats({ key: "a", label: "Cycle", unit: "d", betterWhen: "lower", target: 10 }, [20, 20]),
    ];
    const d = seriesDimensions(stats);
    expect(d[0].value).toBe(50);              // 10/20
    expect(d[d.length - 1].label).toBe("Signal Stability");
  });

  it("falls back to stability when no target is set", () => {
    const stats = [
      computeSeriesStats({ key: "a", label: "Cycle", unit: "d", betterWhen: "lower" }, [10, 10, 10], null),
    ];
    // Perfectly steady series with no target scores full stability.
    expect(seriesDimensions(stats)[0].value).toBe(100);
  });

  it("scores ranking robustness from the breakeven margin", () => {
    const s = computeScenarios([
      { id: "a", name: "A", probability: 90, upside: 100, downside: 10, cost: 0, horizon: 1 },
      { id: "b", name: "B", probability: 10, upside: 100, downside: 10, cost: 0, horizon: 1 },
    ]);
    const d = scenarioDimensions(s);
    expect(d).toHaveLength(4);
    expect(d.find((x) => x.label === "Ranking Robustness")).toBeDefined();
  });

  it("reports zero budget adherence until actuals exist", () => {
    const b = computeBudget(
      [{ id: "1", category: "Personnel", name: "Dev", quantity: 1, unit: "mo", unitCost: 1000 }],
      {
        projectName: "D", projectType: "Software / IT Build", currency: "USD",
        periods: 1, periodLabel: "Month",
        overheadPct: 0, contingencyPct: 10, taxPct: 0, taxOnOverhead: false,
      },
    );
    const adherence = budgetDimensions(b).find((d) => d.label === "Budget Adherence")!;
    expect(adherence.value).toBe(0);
    expect(adherence.insight).toContain("No actuals");
  });
});
