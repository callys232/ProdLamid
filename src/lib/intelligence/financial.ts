/**
 * Archetype C — financial inputs and deterministic derivation.
 *
 * Same contract as the budget engine: the application computes every figure,
 * the model only interprets them. Margins, burn, and runway are arithmetic —
 * an LLM asked to produce them will hallucinate plausible-looking numbers.
 */

export interface FinancialPeriodInput {
  revenue: number;
  cogs:    number;   // direct cost of delivery
  opex:    number;   // operating expenses
}

export interface FinancialInputs {
  currency:    string;
  periodLabel: string;      // "Month" | "Quarter"
  periods:     FinancialPeriodInput[];
  cashBalance: number;      // closing cash at the latest period
  headcount:   number;
}

export interface FinancialPeriodDerived extends FinancialPeriodInput {
  index:           number;
  grossProfit:     number;
  grossMarginPct:  number;
  operatingProfit: number;
  operatingMarginPct: number;
}

export interface FinancialSummary {
  currency:   string;
  periodLabel: string;

  totalRevenue:   number;
  totalCogs:      number;
  totalOpex:      number;
  grossProfit:    number;
  operatingProfit:number;

  grossMarginPct:     number;
  operatingMarginPct: number;

  revenueGrowthPct:   number;   // first → last period
  /** Mean net cash movement per period. Negative = burning. */
  netBurnPerPeriod:   number;
  /** Periods of cash remaining at current burn. null when profitable. */
  runwayPeriods:      number | null;
  revenuePerHead:     number;
  opexRatioPct:       number;   // opex as % of revenue

  periodsDerived: FinancialPeriodDerived[];
  warnings:       string[];
}

const r2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const safe = (n: unknown): number => {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) ? v : 0;
};
const pct = (part: number, whole: number) => (whole === 0 ? 0 : r2((part / whole) * 100));

export function computeFinancials(input: FinancialInputs): FinancialSummary {
  const warnings: string[] = [];
  const periods = input.periods.map((p) => ({
    revenue: safe(p.revenue), cogs: safe(p.cogs), opex: safe(p.opex),
  }));

  const periodsDerived: FinancialPeriodDerived[] = periods.map((p, i) => {
    const grossProfit     = r2(p.revenue - p.cogs);
    const operatingProfit = r2(grossProfit - p.opex);
    return {
      ...p,
      index: i + 1,
      grossProfit,
      grossMarginPct: pct(grossProfit, p.revenue),
      operatingProfit,
      operatingMarginPct: pct(operatingProfit, p.revenue),
    };
  });

  const sum = (k: keyof FinancialPeriodInput) => r2(periods.reduce((a, p) => a + p[k], 0));
  const totalRevenue = sum("revenue");
  const totalCogs    = sum("cogs");
  const totalOpex    = sum("opex");

  const grossProfit     = r2(totalRevenue - totalCogs);
  const operatingProfit = r2(grossProfit - totalOpex);

  const first = periods[0]?.revenue ?? 0;
  const last  = periods[periods.length - 1]?.revenue ?? 0;
  const revenueGrowthPct = first !== 0 ? r2(((last - first) / Math.abs(first)) * 100) : 0;

  // Net cash movement per period — the operating profit averaged out.
  const netBurnPerPeriod = periods.length ? r2(operatingProfit / periods.length) : 0;

  // Runway only means something while burning.
  const cash = safe(input.cashBalance);
  const runwayPeriods =
    netBurnPerPeriod < 0 ? r2(cash / Math.abs(netBurnPerPeriod)) : null;

  const headcount      = Math.max(0, safe(input.headcount));
  const revenuePerHead = headcount > 0 ? r2(totalRevenue / headcount) : 0;

  /* ── Checks a CFO would raise ── */
  if (totalRevenue === 0) {
    warnings.push("No revenue entered — margin and runway figures will not be meaningful.");
  }
  const gm = pct(grossProfit, totalRevenue);
  if (totalRevenue > 0 && gm < 20) {
    warnings.push(`Gross margin is ${gm}% — below the level most businesses can sustain operating costs on.`);
  }
  if (runwayPeriods !== null && runwayPeriods < 6) {
    warnings.push(`Runway is ${runwayPeriods} ${input.periodLabel.toLowerCase()}s at current burn — inside the typical fundraise window.`);
  }
  const opexRatio = pct(totalOpex, totalRevenue);
  if (totalRevenue > 0 && opexRatio > 60) {
    warnings.push(`Operating expenses are ${opexRatio}% of revenue — concentration worth reviewing.`);
  }
  if (headcount === 0) {
    warnings.push("Headcount not entered — revenue per head unavailable.");
  }

  return {
    currency: input.currency,
    periodLabel: input.periodLabel,
    totalRevenue, totalCogs, totalOpex, grossProfit, operatingProfit,
    grossMarginPct:     gm,
    operatingMarginPct: pct(operatingProfit, totalRevenue),
    revenueGrowthPct,
    netBurnPerPeriod,
    runwayPeriods,
    revenuePerHead,
    opexRatioPct: opexRatio,
    periodsDerived,
    warnings,
  };
}

/** Deterministic summary the model reads — it never sees raw arrays. */
export function financialsToPrompt(s: FinancialSummary): string {
  const c = s.currency;
  const lines = [
    `• Total revenue: ${c} ${s.totalRevenue.toLocaleString()} across ${s.periodsDerived.length} ${s.periodLabel.toLowerCase()}s`,
    `• Revenue growth first→last period: ${s.revenueGrowthPct}%`,
    `• Gross profit: ${c} ${s.grossProfit.toLocaleString()} (${s.grossMarginPct}% margin)`,
    `• Operating profit: ${c} ${s.operatingProfit.toLocaleString()} (${s.operatingMarginPct}% margin)`,
    `• Operating expenses: ${s.opexRatioPct}% of revenue`,
    `• Net position per ${s.periodLabel.toLowerCase()}: ${c} ${s.netBurnPerPeriod.toLocaleString()}`,
  ];
  if (s.runwayPeriods !== null) {
    lines.push(`• Runway: ${s.runwayPeriods} ${s.periodLabel.toLowerCase()}s at current burn`);
  } else {
    lines.push(`• Operating profitably — no burn runway applies`);
  }
  if (s.revenuePerHead > 0) {
    lines.push(`• Revenue per head: ${c} ${s.revenuePerHead.toLocaleString()}`);
  }
  return lines.join("\n");
}
