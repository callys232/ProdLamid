import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { rateLimit } from "@/lib/rateLimit";
import { isBodyTooLarge } from "@/lib/sanitize";
import { verifyAuth } from "@/lib/middleware/auth";
import { COST_CATEGORIES, PROJECT_TYPES } from "@/lib/budget/types";
import type { LineItem, CostCategory } from "@/lib/budget/types";

const client = () =>
  new OpenAI({
    apiKey:  process.env.OPENROUTER_API_KEY ?? "",
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "https://lamidconsulting.com",
      "X-Title":      "LAMID ONE — Budget Engine",
    },
  });

const CATEGORY_SET = new Set<string>(COST_CATEGORIES);

/** Coerce whatever the model returns into safe, typed line items. */
function normaliseItems(raw: unknown, periods: number): LineItem[] {
  if (!Array.isArray(raw)) return [];

  return raw.slice(0, 80).flatMap((r: any, i): LineItem[] => {
    const name = String(r?.name ?? "").trim().slice(0, 140);
    if (!name) return [];

    const category: CostCategory = CATEGORY_SET.has(r?.category)
      ? r.category
      : "Other Direct Costs";

    const quantity = Number(r?.quantity);
    const unitCost = Number(r?.unitCost);
    const periodRaw = Number(r?.period);

    return [{
      id:       `ai-${Date.now()}-${i}`,
      category,
      name,
      notes:    r?.notes ? String(r.notes).slice(0, 240) : undefined,
      quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
      unit:     String(r?.unit ?? "unit").trim().slice(0, 24) || "unit",
      unitCost: Number.isFinite(unitCost) && unitCost >= 0 ? unitCost : 0,
      period:   Number.isFinite(periodRaw) && periodRaw >= 1 && periodRaw <= periods
                  ? Math.floor(periodRaw)
                  : undefined,
    }];
  });
}

export async function POST(req: NextRequest) {
  if (isBodyTooLarge(req)) {
    return NextResponse.json({ message: "Request too large." }, { status: 413 });
  }

  const auth = await verifyAuth(req);
  const userId = auth?.userId ?? null;
  if (!userId) {
    return NextResponse.json({ message: "Sign in to generate a budget." }, { status: 401 });
  }

  const limit = await rateLimit(`budget:${userId}`, { windowMs: 24 * 60 * 60_000, max: 50 });
  if (!limit.allowed) {
    return NextResponse.json({ message: "Daily budget generation limit reached." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const projectName  = String(body.projectName ?? "").trim().slice(0, 160);
    const projectType  = PROJECT_TYPES.includes(body.projectType) ? body.projectType : "Custom / Other";
    const scope        = String(body.scope ?? "").trim().slice(0, 3000);
    const currency     = String(body.currency ?? "USD").trim().slice(0, 8).toUpperCase();
    const periods      = Math.min(Math.max(Number(body.periods) || 6, 1), 60);
    const periodLabel  = String(body.periodLabel ?? "Month").slice(0, 16);
    const targetBudget = Number(body.targetBudget);
    const region       = String(body.region ?? "").trim().slice(0, 80);
    const teamSize     = String(body.teamSize ?? "").trim().slice(0, 40);

    if (!projectName || !scope) {
      return NextResponse.json(
        { message: "Project name and scope are required." },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a senior cost estimator and project finance specialist. You build realistic, itemised project budgets.

You return ONLY line items. You NEVER calculate totals, subtotals, overhead, contingency, tax, or grand totals — those are computed downstream by the application. Emitting totals corrupts the budget.

Rules:
- Every line item MUST use one of these exact categories: ${COST_CATEGORIES.join(" | ")}
- quantity and unitCost are NUMBERS ONLY — no currency symbols, no commas, no text
- unitCost is the cost of ONE unit, not the line total
- Use realistic market rates for the stated region and project type
- Choose sensible units: hours, days, weeks, months, units, sqm, licences, seats, trips, lump sum
- Assign each item a "period" (1..${periods}) reflecting when the cost is incurred
- Be comprehensive: include costs teams commonly forget (onboarding, QA, insurance, permits, contingency-adjacent operational costs, decommissioning, warranty/support)
- Aim for 15–35 line items — enough to be actionable, not padded
- Return ONLY valid JSON. No markdown, no code fences, no commentary.`;

    const userPrompt = `Build an itemised cost breakdown for this project.

Project: ${projectName}
Type: ${projectType}
Scope: ${scope}
Currency: ${currency}
Duration: ${periods} ${periodLabel.toLowerCase()}(s)
${region ? `Region / market: ${region}` : ""}
${teamSize ? `Team size: ${teamSize}` : ""}
${Number.isFinite(targetBudget) && targetBudget > 0
  ? `Target budget: ${targetBudget} ${currency}. Aim the sum of (quantity × unitCost) near this figure BEFORE overhead/contingency/tax, and flag in notes anything the target realistically cannot cover.`
  : ""}

Return exactly this JSON:

{
  "lineItems": [
    {
      "category": "<one of the allowed categories>",
      "name": "specific, concrete cost item",
      "quantity": <number>,
      "unit": "<unit>",
      "unitCost": <number>,
      "period": <1-${periods}>,
      "notes": "short assumption or rate basis"
    }
  ],
  "assumptions": ["key assumption behind these figures", "..."],
  "risks": ["cost risk specific to this project", "..."]
}`;

    const response = await client().chat.completions.create({
      model:       "anthropic/claude-sonnet-4-6",
      temperature: 0.3,          // low — estimates should be stable, not creative
      max_tokens:  4000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt },
      ],
    });

    const raw     = response.choices[0]?.message?.content ?? "{}";
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed  = JSON.parse(cleaned);

    const lineItems = normaliseItems(parsed.lineItems, periods);
    if (lineItems.length === 0) {
      return NextResponse.json(
        { message: "Could not derive line items. Try describing the scope in more detail." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      lineItems,
      assumptions: Array.isArray(parsed.assumptions) ? parsed.assumptions.slice(0, 12).map(String) : [],
      risks:       Array.isArray(parsed.risks)       ? parsed.risks.slice(0, 12).map(String)       : [],
    });

  } catch (error) {
    console.error("[Budget] generation failed:", error);
    return NextResponse.json(
      { message: "Budget generation failed. Please try again." },
      { status: 500 }
    );
  }
}
