/**
 * Worked examples.
 *
 * Every figure here was produced by running the inputs described through the
 * product's own compute layers — lib/intelligence/{financial,inputSpec,roster,
 * scenario,assessment} and lib/budget/compute. The `findings` are the exact
 * warning strings those functions emitted, not paraphrases.
 *
 * If a compute layer changes, regenerate these rather than editing them by
 * hand. A worked example that no longer matches the engine is worse than none.
 */

export type Stat = { label: string; value: string; sub?: string; bad?: boolean };

export interface UseCaseStage {
  pillar:    string;
  colour:    string;
  /** Which lucide icon the page should render. */
  icon:      "finance" | "grow" | "talent" | "core" | "budget" | "assessment";
  engine:    string;
  archetype: string;
  question:  string;
  input:     string;
  stats:     Stat[];
  findings:  string[];
  href:      string;
}

export interface UseCase {
  slug:     string;
  name:     string;
  sector:   string;
  size:     string;
  /** The question the organisation walked in with. */
  ask:      string;
  /** One line for the index card. */
  teaser:   string;
  /** The headline the engines led to. */
  verdict:  string;
  accent:   string;
  stages:   UseCaseStage[];
  /** Closing narrative paragraphs. */
  closing:  string[];
}

const C = { finance: "#B45309", grow: "#047857", talent: "#6D28D9", core: "#2563EB" };

export const USE_CASES: UseCase[] = [
  /* ── 1 ─────────────────────────────────────────────────────────────── */
  {
    slug: "meridian-logistics",
    name: "Meridian Logistics",
    sector: "Freight & distribution",
    size: "240 staff",
    ask: "Should we build a second hub?",
    teaser: "A board asked about a building. Six tools answered about the business underneath it.",
    verdict: "Don't build the hub. Not yet.",
    accent: C.finance,
    stages: [
      {
        pillar: "LAMID FINANCE", colour: C.finance, icon: "finance",
        engine: "Financial Visibility · Cost Optimization", archetype: "Financial",
        question: "Can we afford to expand at all?",
        input: "Six months of revenue, cost of delivery and operating expense, with opex split across six lines.",
        stats: [
          { label: "Revenue, 6 months", value: "$12,200,000" },
          { label: "Gross margin",      value: "36.29%" },
          { label: "Operating margin",  value: "2.02%",   sub: "of revenue", bad: true },
          { label: "Revenue per head",  value: "$50,833", sub: "across 240 staff" },
        ],
        findings: [
          "Payroll & Benefits is 61.12% of operating cost — a single line carrying more than half the base.",
          "Growing faster than revenue: Software & Subscriptions, Marketing & Sales, Travel & Expenses, Professional Fees. These are where cost is getting away.",
        ],
        href: "/f04-cost-optimization",
      },
      {
        pillar: "LAMID GROW", colour: C.grow, icon: "grow",
        engine: "Real-Time Cadence Pulse", archetype: "Time series",
        question: "Is delivery holding up while we grow?",
        input: "Six weeks of cycle time, on-time completion and meeting load, each against a target.",
        stats: [
          { label: "Delivery cycle time", value: "19 days", sub: "target 10 · 52.6% attainment", bad: true },
          { label: "On-time completion",  value: "68%",     sub: "target 85 · down 17.1%",       bad: true },
          { label: "Meeting load",        value: "18 hrs",  sub: "target 10 · up 63.6%",         bad: true },
          { label: "Targets met",         value: "0 of 3",                                        bad: true },
        ],
        findings: [
          "Every metric moved away from its target across the six weeks measured.",
          "Coordination overhead rose 63.6% while on-time delivery fell — the organisation is spending more time to deliver less.",
        ],
        href: "/r14-real-time-cadence-pulse",
      },
      {
        pillar: "LAMID TALENT", colour: C.talent, icon: "talent",
        engine: "Succession Pipeline", archetype: "Roster",
        question: "Do we have the people to run a second site?",
        input: "Five roles with headcount, capability, attrition risk and named successors.",
        stats: [
          { label: "Weighted capability", value: "2.6 / 5", sub: "48% below fully capable",       bad: true },
          { label: "Headcount at risk",   value: "87.5%",   sub: "in high-attrition roles",       bad: true },
          { label: "Bench coverage",      value: "33.3%",   sub: "of critical roles",             bad: true },
          { label: "Single points",       value: "2",       sub: "critical roles, no successor",  bad: true },
        ],
        findings: [
          "2 critical roles have no ready successor: Fleet Maintenance Lead, Compliance Officer.",
          "Capability is weighted by headcount, so the 14-person warehouse team at 2/5 pulls the figure well below the role average.",
        ],
        href: "/a21-succession-pipeline",
      },
      {
        pillar: "LAMID CORE", colour: C.core, icon: "core",
        engine: "Predictive Foresight", archetype: "Scenario",
        question: "Which expansion option is actually worth it?",
        input: "Three options with probability, upside, downside, cost and horizon.",
        stats: [
          { label: "Highest value", value: "Partner with a 3PL", sub: "$505,000 net of cost" },
          { label: "Lowest risk",   value: "Lease overflow space" },
          { label: "Breakeven",     value: "83.96%",   sub: "where lease overtakes partner" },
          { label: "Margin",        value: "3.96 pts", sub: "above the 80% entered", bad: true },
        ],
        findings: [
          "Highest-value option (Partner with a 3PL) is not the lowest-risk one (Lease overflow space).",
          "The ranking is fragile: Lease overflow space overtakes Partner with a 3PL once its probability passes 83.96% — only 3.96 points above the 80% entered.",
        ],
        href: "/q46-predictive-foresight",
      },
      {
        pillar: "LAMID FINANCE", colour: C.finance, icon: "budget",
        engine: "Budgeting & Forecasting", archetype: "Line item",
        question: "What does the build cost, and are we on plan?",
        input: "Four cost lines with quantity, unit cost and phasing; two carrying actuals.",
        stats: [
          { label: "Direct costs", value: "$2,228,200" },
          { label: "Grand total",  value: "$2,853,121", sub: "with overhead, contingency and tax" },
          { label: "Against plan", value: "+5.04%",     sub: "on tracked lines", bad: true },
          { label: "Projected",    value: "$2,996,918", sub: "at the current rate", bad: true },
        ],
        findings: [
          "Largest overrun: Hub fit-out at 6.29% above plan.",
          "At the current overrun rate the project lands near 2,996,918 against a 2,853,121 budget.",
        ],
        href: "/f02-budgeting-forecasting",
      },
      {
        pillar: "LAMID CORE", colour: C.core, icon: "assessment",
        engine: "Governance Intelligence", archetype: "Assessment",
        question: "Can we govern a decision of this size?",
        input: "Four governance dimensions rated 0–5, weighted by importance, each with an evidence level.",
        stats: [
          { label: "Weighted index",    value: "62%" },
          { label: "Evidence-adjusted", value: "53.8%",  sub: "8.2 points discounted", bad: true },
          { label: "Spread",            value: "40 pts", sub: "best to worst", bad: true },
          { label: "Weakest",           value: "Decision Rights Clarity" },
        ],
        findings: [
          "1 dimension is rated 4 or above with no evidence: Escalation Discipline. Those scores rest on assertion.",
          "40 points separate the strongest and weakest dimension — Decision Rights Clarity is holding the overall score down more than the average suggests.",
        ],
        href: "/x03-governance",
      },
    ],
    closing: [
      "The board asked about a building. The tools answered about the business underneath it: a 2.02% operating margin, delivery moving away from every target it has, a workforce at 2.6 out of 5 with two critical roles nobody can cover, and four cost lines already growing faster than revenue.",
      "On the numbers the 3PL partnership returns most — $505,000 net. But that ranking sits on a 3.96-point margin, inside the error bar of anyone's probability estimate. The honest reading is that partnering and leasing are close enough to be a judgement call, and building is not in contention.",
      "The governance assessment is why that matters. It scores 62% on stated ratings and 53.8% once evidence is accounted for, and the dimension holding it down is decision rights. An organisation that cannot evidence who decides what should not commit $2.9m on a fragile ranking.",
    ],
  },

  /* ── 2 ─────────────────────────────────────────────────────────────── */
  {
    slug: "northwind-health",
    name: "Northwind Health",
    sector: "Healthcare provider",
    size: "104 clinical staff",
    ask: "How do we stop the rota collapsing?",
    teaser: "Agency cover felt safest. The maths said it can never win.",
    verdict: "Fund retention. Agency cover cannot pay for itself.",
    accent: C.talent,
    stages: [
      {
        pillar: "LAMID TALENT", colour: C.talent, icon: "talent",
        engine: "Succession Pipeline", archetype: "Roster",
        question: "Where is the workforce actually breaking?",
        input: "Five clinical roles with headcount, capability, attrition risk and successors.",
        stats: [
          { label: "Weighted capability", value: "2.9 / 5", sub: "42% below fully capable", bad: true },
          { label: "Headcount at risk",   value: "64.4%",   sub: "in high-attrition roles", bad: true },
          { label: "Bench coverage",      value: "50%",     sub: "of critical roles",       bad: true },
          { label: "Single points",       value: "2",       sub: "no successor at all",     bad: true },
        ],
        findings: [
          "2 critical roles have no ready successor: Theatre Coordinator, Pharmacy Lead.",
          "64.4% of headcount sits in high-attrition-risk roles.",
        ],
        href: "/a21-succession-pipeline",
      },
      {
        pillar: "LAMID GROW", colour: C.grow, icon: "grow",
        engine: "Real-Time Cadence Pulse", archetype: "Time series",
        question: "How fast is cover degrading?",
        input: "Six weeks of shift cover and time-to-fill, each against a target.",
        stats: [
          { label: "Shifts covered on time", value: "78%",     sub: "target 85 · down 17%",   bad: true },
          { label: "Days to fill a vacancy", value: "58 days", sub: "target 30 · up 70.6%",   bad: true },
          { label: "Time-to-fill attainment", value: "51.7%",  sub: "of target",              bad: true },
          { label: "Direction",              value: "Both worsening",                          bad: true },
        ],
        findings: [
          "Time to fill a vacancy rose 70.6% in six weeks while shift cover fell 17%.",
          "The two move together: every week a vacancy stays open, cover degrades further.",
        ],
        href: "/r14-real-time-cadence-pulse",
      },
      {
        pillar: "LAMID CORE", colour: C.core, icon: "assessment",
        engine: "Governance Intelligence", archetype: "Assessment",
        question: "Is this a staffing problem or a management one?",
        input: "Four workforce-governance dimensions rated, weighted and evidenced.",
        stats: [
          { label: "Weighted index",    value: "44.4%",  bad: true },
          { label: "Evidence-adjusted", value: "39.1%",  bad: true },
          { label: "Spread",            value: "60 pts", sub: "best to worst", bad: true },
          { label: "Weakest",           value: "Escalation Cover" },
        ],
        findings: [
          "60 points separate the strongest and weakest dimension — Escalation Cover is holding the overall score down more than the average suggests.",
          "Escalation Cover and Rota Fairness are both critical-weighted and both rated at or below 2 of 5.",
        ],
        href: "/x03-governance",
      },
      {
        pillar: "LAMID CORE", colour: C.core, icon: "core",
        engine: "Predictive Foresight", archetype: "Scenario",
        question: "Agency, retention, or overseas recruitment?",
        input: "Three options with probability, upside, downside, cost and horizon.",
        stats: [
          { label: "Highest value", value: "Retention programme", sub: "$712,000 net of cost" },
          { label: "Lowest risk",   value: "Agency cover",        sub: "narrowest spread" },
          { label: "Agency breakeven", value: "Unreachable",      sub: "cannot overtake at any probability", bad: true },
          { label: "Nearest rival", value: "31.86 pts away",      sub: "overseas recruitment" },
        ],
        findings: [
          "Highest-value option (Retention programme) is not the lowest-risk one (Agency cover).",
          "Agency cover has no breakeven probability — at $1.45m against a $400k upside it cannot overtake retention however likely it is to work.",
        ],
        href: "/q46-predictive-foresight",
      },
    ],
    closing: [
      "Agency cover is the reflex, and the scenario tool is unusually blunt about it: there is no probability at which it wins. At $1.45m of cost against a $400,000 upside, it is the lowest-risk option and a guaranteed loss. Safe and wrong are not the same thing.",
      "Retention returns $712,000 net, and its nearest rival sits 31.86 points away — the widest margin in any of these examples. This is the rare case where the ranking is not fragile and the decision is not close.",
      "The governance assessment explains why retention is the lever. Escalation Cover scores 1 of 5 against a critical weighting, and it is documented — this is not a rating anyone inflated. Staff are not leaving over pay alone; they are leaving a rota nobody can escalate out of.",
    ],
  },

  /* ── 3 ─────────────────────────────────────────────────────────────── */
  {
    slug: "cobalt-studio",
    name: "Cobalt Studio",
    sector: "B2B software",
    size: "38 staff",
    ask: "Do we raise, or do we cut?",
    teaser: "Utilisation at 93% looked like a team performing. Rework had doubled.",
    verdict: "Cut first. The raise is a coin flip.",
    accent: C.core,
    stages: [
      {
        pillar: "LAMID FINANCE", colour: C.finance, icon: "finance",
        engine: "Financial Visibility", archetype: "Financial",
        question: "How long do we actually have?",
        input: "Six months of revenue, COGS and operating expense with a cash balance and headcount.",
        stats: [
          { label: "Gross margin",     value: "71.41%",   sub: "healthy" },
          { label: "Operating margin", value: "−103.93%", sub: "of revenue", bad: true },
          { label: "Burn per month",   value: "$255,667",                    bad: true },
          { label: "Runway",           value: "8.21 months", sub: "at current burn", bad: true },
        ],
        findings: [
          "Operating expenses are 175.34% of revenue — concentration worth reviewing.",
          "Payroll & Benefits is 70.09% of operating cost, and 122.9% of revenue on its own.",
        ],
        href: "/f01-financial-visibility",
      },
      {
        pillar: "LAMID GROW", colour: C.grow, icon: "grow",
        engine: "Productivity Pulse", archetype: "Time series",
        question: "Is the team delivering more, or just busier?",
        input: "Six sprints of throughput, rework rate and capacity utilisation against targets.",
        stats: [
          { label: "Throughput",    value: "49 items", sub: "target 55 · up 28.9%" },
          { label: "Rework rate",   value: "27%",      sub: "target 10 · up 92.9%", bad: true },
          { label: "Utilisation",   value: "93%",      sub: "target 85 · above band", bad: true },
          { label: "Rework attainment", value: "37%",  sub: "of target", bad: true },
        ],
        findings: [
          "Throughput rose 28.9% while rework rose 92.9% — output grew slower than the cost of redoing it.",
          "Utilisation is above the 85% band. Past that point work queues rather than completes, and the rework figure is what that looks like.",
        ],
        href: "/p30-flow",
      },
      {
        pillar: "LAMID CORE", colour: C.core, icon: "core",
        engine: "Predictive Foresight", archetype: "Scenario",
        question: "Raise, cut, or reprice?",
        input: "Three options with probability, upside, downside, cost and horizon.",
        stats: [
          { label: "Highest value", value: "Cut 20% of cost", sub: "$960,000 net" },
          { label: "Lowest risk",   value: "Push price up 15%" },
          { label: "Breakeven",     value: "55.71%",   sub: "where the raise overtakes" },
          { label: "Margin",        value: "5.71 pts", sub: "above the 50% entered", bad: true },
        ],
        findings: [
          "The ranking is fragile: Raise a bridge round overtakes Cut 20% of cost once its probability passes 55.71% — only 5.71 points above the 50% entered.",
          "1 option sits near 50% probability — that usually means the estimate is a guess.",
        ],
        href: "/q46-predictive-foresight",
      },
    ],
    closing: [
      "A 71% gross margin and 31% revenue growth read like a company working. The operating margin is −103.93% and there are 8.21 months of runway. Both things are true, which is why looking at one number was never going to settle it.",
      "The productivity tool found the mechanism. Utilisation at 93% sits above the 85% band where work starts queueing instead of completing, and rework nearly doubled over the same six sprints. The team is not underperforming; it is overloaded, and the overload is being paid for twice.",
      "On expected value, cutting wins at $960,000 net. But the tool flags its own answer: the bridge round overtakes it at 55.71% against the 50% entered, and it warns that a 50% estimate usually means nobody knows. Cutting is the decision you can make without resolving that uncertainty first — which is the argument for doing it now rather than after the raise fails.",
    ],
  },

  /* ── 4 ─────────────────────────────────────────────────────────────── */
  {
    slug: "ubuntu-foundation",
    name: "Ubuntu Foundation",
    sector: "Donor-funded programme",
    size: "$534k grant",
    ask: "Are we ready for the donor audit?",
    teaser: "Fund traceability was rated 5 out of 5. Nobody could produce a document for it.",
    verdict: "Not ready. The strongest claim has the weakest backing.",
    accent: C.finance,
    stages: [
      {
        pillar: "LAMID FINANCE", colour: C.finance, icon: "budget",
        engine: "Budgeting & Forecasting", archetype: "Line item",
        question: "Where has the grant actually gone?",
        input: "Five cost lines across five categories with phasing; three carrying actuals.",
        stats: [
          { label: "Direct costs", value: "$475,200" },
          { label: "Grand total",  value: "$533,887", sub: "with overhead and contingency" },
          { label: "Against plan", value: "+9.48%",   sub: "on tracked lines", bad: true },
          { label: "Projected",    value: "$584,500", sub: "$50k above grant", bad: true },
        ],
        findings: [
          "Largest overrun: Rural deployment at 20.77% above plan.",
          "At the current overrun rate the project lands near 584,500 against a 533,887 budget.",
        ],
        href: "/f02-budgeting-forecasting",
      },
      {
        pillar: "LAMID CORE", colour: C.core, icon: "assessment",
        engine: "Compliance Intelligence", archetype: "Assessment",
        question: "Will our controls survive scrutiny?",
        input: "Four compliance dimensions rated 0–5, weighted, each with an evidence level.",
        stats: [
          { label: "Weighted index",    value: "70%",     sub: "on stated ratings" },
          { label: "Evidence-adjusted", value: "51.4%",   sub: "18.6 points discounted", bad: true },
          { label: "Spread",            value: "60 pts",  sub: "best to worst", bad: true },
          { label: "Unsupported",       value: "Fund Traceability", sub: "rated 5, no evidence", bad: true },
        ],
        findings: [
          "1 dimension is rated 4 or above with no evidence: Fund Traceability. Those scores rest on assertion.",
          "The score drops 18.6 points once evidence is accounted for.",
          "60 points separate the strongest and weakest dimension — Beneficiary Verification is holding the overall score down more than the average suggests.",
        ],
        href: "/x04-compliance",
      },
    ],
    closing: [
      "The programme rated its own fund traceability 5 out of 5 — the highest score on the sheet, weighted critical. It is also the only dimension with no evidence behind it. That combination is what the assessment tool exists to catch, and it is precisely what a donor auditor opens with.",
      "The gap is not rhetorical. Stated, the programme scores 70%. Evidence-adjusted, 51.4%. An auditor does not grade the stated number.",
      "The budget adds urgency rather than reassurance: 9.48% over on the lines being tracked, with rural deployment 20.77% above plan and a projected outturn $50,000 beyond the grant. Overspend against a grant is recoverable when it is documented and difficult when it is not — and documentation is the exact dimension scoring zero.",
    ],
  },
];

export const getUseCase = (slug: string) => USE_CASES.find((u) => u.slug === slug);
