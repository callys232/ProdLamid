import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { rateLimit } from "@/lib/rateLimit";
import { sanitiseInput, isBodyTooLarge, getClientIP } from "@/lib/sanitize";
import { SOVEREIGN_MOCK } from "@/mocks/sovereign";

const client = () => new OpenAI({
  apiKey:  process.env.OPENROUTER_API_KEY ?? "",
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://lamidconsulting.com",
    "X-Title":      "LAMID ONE — Sovereign Architecture Assessment",
  },
});

export async function POST(req: NextRequest) {
  /* ── Body size gate (64 KB max) ── */
  if (isBodyTooLarge(req)) {
    return NextResponse.json({ message: "Request too large." }, { status: 413 });
  }

  /* ── Rate limit by real IP ── */
  const ip    = getClientIP(req);
  const limit = await rateLimit(`sovereign:${ip}`, { windowMs: 24 * 60 * 60_000, max: 5 });
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Daily Sovereign Assessment limit reached. Try again tomorrow.", fallback: true },
      { status: 429 }
    );
  }

  try {
    const body  = await req.json();
    const clean = sanitiseInput(body);
    const { organisationName, industry, size, currentChallenge, sovereignGoal, additionalContext } = clean;

    if (!organisationName?.trim()) {
      return NextResponse.json({ message: "Organisation name is required." }, { status: 400 });
    }

    const systemPrompt = `You are LAMID ONE's Sovereign Architecture Analyst — the highest-level enterprise intelligence authority. You assess enterprises against the Seven-Fold Sovereign Architecture: Identity, Presence, Realm, Action, Conduct, Operation, and Expansion.

You produce the complete Sovereign Architecture Assessment for a specific enterprise, personalising ALL data to their actual situation. Never produce generic output. Every score, every status, every milestone date, every action must reflect this specific enterprise's reality.

SOVEREIGN ARCHITECTURE FRAMEWORK:
- Phase I: Seven Artifacts (Sovereign Charter, Dominion Map, Seal of Authority, Covenant Protocol, Throne Blueprint, Realm Codex, Expansion Mandate)
- Phase II: Post-Seal Construction — translating artifacts into operational frameworks, governance matrices, and multi-realm activation sequences
- Seven Throne Positions: Sovereign Architect (ESS), Chief Covenant Officer (SMP), Domain Marshal (OCC), Realm Codex Keeper (KMS), Integration Commander (EIB), Expansion Chancellor (GIP), Seal Guardian (IAMS)
- Five Realms: Foundation → Covenant → Integration → Expansion → Sovereign
- Three Governance Tiers: Strategic (Sovereign Council, unanimous), Operational (Domain Lords, 2/3 quorum), Tactical (Realm Operators, individual)
- Four Expansion Vectors: Horizontal Domain Expansion, Vertical Integration Depth, Alliance Protocol Network, Digital Realm Sovereignty
- Four Operational Frameworks: Constitutional, Integration & Mapping, Governance & Accountability, Expansion & Activation

You MUST return ONLY valid JSON matching exactly the structure of the example. Every array must be complete. Scores must be realistic for the enterprise described.`;

    const userPrompt = `Generate a complete Sovereign Architecture Assessment for:

Organisation: ${organisationName}
Industry: ${industry || "Not specified"}
Size: ${size || "Not specified"}
Current Challenge: ${currentChallenge || "Not specified"}
Sovereign Goal: ${sovereignGoal || "Not specified"}
Additional Context: ${additionalContext || "None"}

Return a JSON object with this exact structure (personalise all values to this enterprise):

{
  "enterprise": {
    "name": "${organisationName}",
    "phase": "II",
    "status": "Active",
    "initiatedDate": "Q3 2026",
    "sealStatus": "Sealed & Initiated",
    "industry": "${industry || "Not specified"}",
    "imperativeStatement": "2-3 sentence specific imperative statement for this enterprise — what Phase II means for them specifically"
  },
  "commandOverview": {
    "artifacts": 7,
    "artifactsNote": "specific note about this enterprise's artifact translation progress",
    "governanceTiers": 3,
    "governanceNote": "specific note about this enterprise's governance activation",
    "thronePositions": 7,
    "throneNote": "specific note about this enterprise's throne-to-system mapping",
    "realmPhases": 5,
    "realmNote": "specific note about this enterprise's realm activation status"
  },
  "artifacts": [
    { "id": 1, "name": "Sovereign Charter", "translation": "Constitutional Authority Framework", "description": "enterprise-specific description", "status": "sealed|translating|pending", "completionPct": 0-100 },
    ... all 7 artifacts with realistic statuses for this enterprise
  ],
  "thrones": [
    { "number": 1, "title": "Sovereign Architect", "system": "Enterprise Strategy System", "systemCode": "ESS", "description": "enterprise-specific description", "status": "active|assigned|pending" },
    ... all 7 thrones
  ],
  "realms": [
    { "number": 1, "name": "Foundation Realm", "timeline": "Months 1-2", "status": "complete|active|pending", "progress": 0-100, "milestones": ["milestone 1", "milestone 2", "milestone 3"] },
    ... all 5 realms with realistic progress for this enterprise
  ],
  "milestones": [
    { "milestoneNum": 1, "quarter": "Q3", "year": "2026", "title": "enterprise-specific milestone title", "description": "enterprise-specific description", "details": ["detail 1", "detail 2", "detail 3"], "status": "initiated|scheduled|pending|complete" },
    ... all 4 milestones
  ],
  "soverignSealScore": 0-100,
  "currentPhase": "specific description of where this enterprise is right now",
  "nextAction": "specific, immediately actionable next step for this enterprise to advance sovereign status"
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
      ...SOVEREIGN_MOCK,
      ...partial,
      governanceTiers:   SOVEREIGN_MOCK.governanceTiers,
      integrationStages: SOVEREIGN_MOCK.integrationStages,
      expansionVectors:  SOVEREIGN_MOCK.expansionVectors,
      frameworks:        SOVEREIGN_MOCK.frameworks,
      decisionTypes:     SOVEREIGN_MOCK.decisionTypes,
    };

    return NextResponse.json({ result });

  } catch (error) {
    console.error("Sovereign API error:", error);
    /* On AI failure, return mock data so the UI always shows something */
    return NextResponse.json({ result: SOVEREIGN_MOCK, fallback: true });
  }
}
