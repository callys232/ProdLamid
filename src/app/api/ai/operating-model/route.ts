import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { rateLimit } from "@/lib/rateLimit";
import { sanitiseInput, isBodyTooLarge, getClientIP } from "@/lib/sanitize";
import { verifyAuth } from "@/lib/middleware/auth";
import { OPERATING_MODEL_MOCK } from "@/mocks/operatingModel";

const client = () => new OpenAI({
  apiKey:  process.env.OPENROUTER_API_KEY ?? "",
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://lamidconsulting.com",
    "X-Title":      "LAMID ONE — Enterprise Operating Model Assessment",
  },
});

export async function POST(req: NextRequest) {
  /* ── Body size gate (64 KB max) ── */
  if (isBodyTooLarge(req)) {
    return NextResponse.json({ message: "Request too large." }, { status: 413 });
  }

  /* Membership required — this route spends paid LLM compute. Visitors see the
     mock assessment client-side and never legitimately reach it. Matches the
     gate already on /api/ai/intelligence. */
  const auth = await verifyAuth(req);
  if (!auth?.userId) {
    return NextResponse.json(
      { message: "Sign in to run an Operating Model Assessment." },
      { status: 401 }
    );
  }

  /* Rate limit per member, falling back to IP for anything unattributable. */
  const limit = await rateLimit(
    `operating-model:${auth.userId ?? getClientIP(req)}`,
    { windowMs: 24 * 60 * 60_000, max: 5 }
  );
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Daily Operating Model Assessment limit reached. Try again tomorrow.", fallback: true },
      { status: 429 }
    );
  }

  try {
    const body  = await req.json();
    const clean = sanitiseInput(body);
    const { organisationName, industry, size, currentChallenge, operatingModelGoal, additionalContext } = clean;

    if (!organisationName?.trim()) {
      return NextResponse.json({ message: "Organisation name is required." }, { status: 400 });
    }

    const systemPrompt = `You are LAMID ONE's Enterprise Operating Model analyst. You assess an enterprise across seven dimensions: Identity, Presence, Domain, Action, Conduct, Operation, and Expansion.

You produce a complete Operating Model Assessment for a specific enterprise, personalising ALL data to their actual situation. Never produce generic output. Every score, every status, every milestone date, every action must reflect this specific enterprise's reality.

ENTERPRISE OPERATING MODEL FRAMEWORK:
- Phase I: Seven Artifacts (Operating Charter, Coverage Map, Access Authority Standard, Partner Agreement Protocol, Role–System Blueprint, Operating Handbook, Expansion Directive)
- Phase II: Post-Approval Build — translating artifacts into operational frameworks, governance matrices, and multi-domain activation sequences
- Seven Leadership Roles: Chief Operating Architect (ESS), Chief Partnerships Officer (SMP), Head of Operations (OCC), Head of Operating Standards (KMS), Head of Integration (EIB), Head of Expansion (GIP), Head of Access & Identity (IAMS)
- Five Rollout Phases: Foundation → Agreements → Integration → Expansion → Full Operation
- Three Governance Tiers: Strategic (Executive Council, unanimous), Operational (Domain Leads, 2/3 quorum), Tactical (Domain Operators, individual)
- Four Expansion Vectors: Horizontal Domain Expansion, Vertical Integration Depth, Alliance Protocol Network, Digital Domain Ownership
- Four Operational Frameworks: Constitutional, Integration & Mapping, Governance & Accountability, Expansion & Activation

You MUST return ONLY valid JSON matching exactly the structure of the example. Every array must be complete. Scores must be realistic for the enterprise described.`;

    const userPrompt = `Generate a complete Operating Model Assessment for:

Organisation: ${organisationName}
Industry: ${industry || "Not specified"}
Size: ${size || "Not specified"}
Current Challenge: ${currentChallenge || "Not specified"}
Operating Model Goal: ${operatingModelGoal || "Not specified"}
Additional Context: ${additionalContext || "None"}

Return a JSON object with this exact structure (personalise all values to this enterprise):

{
  "enterprise": {
    "name": "${organisationName}",
    "phase": "II",
    "status": "Active",
    "initiatedDate": "Q3 2026",
    "approvalStatus": "Approved & Underway",
    "industry": "${industry || "Not specified"}",
    "imperativeStatement": "2-3 sentence specific imperative statement for this enterprise — what Phase II means for them specifically"
  },
  "commandOverview": {
    "artifacts": 7,
    "artifactsNote": "specific note about this enterprise's artifact translation progress",
    "governanceTiers": 3,
    "governanceNote": "specific note about this enterprise's governance activation",
    "leadershipRoles": 7,
    "roleNote": "specific note about this enterprise's role-to-system mapping",
    "rolloutPhases": 5,
    "phaseNote": "specific note about this enterprise's domain activation status"
  },
  "artifacts": [
    { "id": 1, "name": "Operating Charter", "translation": "Constitutional Authority Framework", "description": "enterprise-specific description", "status": "approved|translating|pending", "completionPct": 0-100 },
    ... all 7 artifacts with realistic statuses for this enterprise
  ],
  "leadershipRoles": [
    { "number": 1, "title": "Chief Operating Architect", "system": "Enterprise Strategy System", "systemCode": "ESS", "description": "enterprise-specific description", "status": "active|assigned|pending" },
    ... all 7 leadershipRoles
  ],
  "rolloutPhases": [
    { "number": 1, "name": "Foundation Phase", "timeline": "Months 1-2", "status": "complete|active|pending", "progress": 0-100, "milestones": ["milestone 1", "milestone 2", "milestone 3"] },
    ... all 5 rolloutPhases with realistic progress for this enterprise
  ],
  "milestones": [
    { "milestoneNum": 1, "quarter": "Q3", "year": "2026", "title": "enterprise-specific milestone title", "description": "enterprise-specific description", "details": ["detail 1", "detail 2", "detail 3"], "status": "initiated|scheduled|pending|complete" },
    ... all 4 milestones
  ],
  "operatingModelScore": 0-100,
  "currentPhase": "specific description of where this enterprise is right now",
  "nextAction": "specific, immediately actionable next step for this enterprise to advance operating-model maturity"
}

All other arrays (governanceTiers, integrationStages, expansionVectors, frameworks, decisionTypes) keep the standard structure but with enterprise-specific descriptions.`;

    const response = await client().chat.completions.create({
      model:       "anthropic/claude-sonnet-4-6",
      temperature: 0.65,
      max_tokens:  4000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt },
      ],
    });

    const raw     = response.choices[0]?.message?.content ?? "{}";
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const partial = JSON.parse(cleaned);

    /* Merge AI output with the full mock structure to ensure completeness */
    const result = {
      ...OPERATING_MODEL_MOCK,
      ...partial,
      governanceTiers:   OPERATING_MODEL_MOCK.governanceTiers,
      integrationStages: OPERATING_MODEL_MOCK.integrationStages,
      expansionVectors:  OPERATING_MODEL_MOCK.expansionVectors,
      frameworks:        OPERATING_MODEL_MOCK.frameworks,
      decisionTypes:     OPERATING_MODEL_MOCK.decisionTypes,
    };

    return NextResponse.json({ result });

  } catch (error) {
    console.error("Operating Model API error:", error);
    /* On AI failure, return mock data so the UI always shows something */
    return NextResponse.json({ result: OPERATING_MODEL_MOCK, fallback: true });
  }
}
