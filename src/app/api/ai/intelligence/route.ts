import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { rateLimit } from "@/lib/rateLimit";
import { sanitiseInput, isBodyTooLarge } from "@/lib/sanitize";
import { verifyAuth } from "@/lib/middleware/auth";
import { validateIntelligenceResult } from "@/lib/intelligence/validateResult";
import connectDB from "@/lib/db";
import { Users } from "@/lib/models/User";

const client = () =>
  new OpenAI({
    apiKey:  process.env.OPENROUTER_API_KEY ?? "",
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "https://lamidconsulting.com",
      "X-Title":      "LAMID ONE — Intelligence Engine",
    },
  });

export async function POST(req: NextRequest) {
  if (isBodyTooLarge(req)) {
    return NextResponse.json({ message: "Request too large." }, { status: 413 });
  }

  /* Membership is required to reach real AI output. Visitors interact with the
     tool UI and receive a client-side preview, so they never legitimately call
     this route — treating them as anonymous-but-allowed leaked paid compute. */
  const auth = await verifyAuth(req);
  const userId = auth?.userId ?? null;

  if (!userId) {
    return NextResponse.json(
      { message: "Sign in to generate intelligence results." },
      { status: 401 }
    );
  }

  /* Demo accounts never touch the database and their IDs are not ObjectIds,
     so findById would throw. They are already authenticated by a signed token
     at this point, so allow them straight through. */
  const isDemoUser = userId.startsWith("demo-") || userId.startsWith("dev-");

  // Server-side account gate — runs for every real caller, no longer skippable
  if (!isDemoUser) {
    try {
      await connectDB();
      const user = await Users
        .findById(userId)
        .select("status isDeleted")
        .lean() as any;

      if (!user) {
        return NextResponse.json({ message: "Account not found." }, { status: 401 });
      }
      // Any signed-in member may run the free engines; paid tiers are additive.
      if (user.status === "suspended" || user.isDeleted === true) {
        return NextResponse.json({ message: "Account is not active." }, { status: 403 });
      }
    } catch (accountErr) {
      console.error("[Intelligence] Account check failed:", accountErr);
      return NextResponse.json({ message: "Service temporarily unavailable. Please try again." }, { status: 503 });
    }
  }

  // 50 runs/day per member
  const limit = await rateLimit(`intelligence:${userId}`, { windowMs: 24 * 60 * 60_000, max: 50 });
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Daily intelligence limit reached. Sign in for higher limits or try again tomorrow." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { moduleId, engineName, seriesName, purpose, dimensionLabels, driverContext, correctionProtocols } = body;
    const context = sanitiseInput(body.context ?? {});
    /* Pre-computed series statistics from the client. Already derived in
       TypeScript — the model interprets these, it never recalculates them. */
    const measuredData = typeof body.measuredData === "string"
      ? body.measuredData.slice(0, 2000)
      : "";

    if (!context.organisationName?.trim()) {
      return NextResponse.json({ message: "Organisation name is required." }, { status: 400 });
    }
    if (!Array.isArray(dimensionLabels) || !Array.isArray(correctionProtocols)) {
      return NextResponse.json({ message: "dimensionLabels and correctionProtocols are required arrays." }, { status: 400 });
    }

    const systemPrompt = `You are a senior enterprise intelligence analyst at LAMID ONE — the world's leading HumanAI consulting ecosystem. You are running the ${engineName} (${moduleId}) from the ${seriesName}.

MODULE PURPOSE:
${purpose}

DIMENSION FRAMEWORK:
The module assesses these dimensions: ${dimensionLabels.join(", ")}

DRIVER FRAMEWORK (seven universal drivers):
1. Identity Drivers — mission, positioning, core capability, and what the organisation is known for
2. Market Drivers — demand cycles, customer behaviour, competitive pressure
3. Cultural Drivers — team dynamics, leadership alignment, workforce engagement
4. Human Drivers — skills, capacity, retention, individual performance
5. Structural Drivers — operating model, processes, systems, reporting lines
6. Timing Drivers — sequencing, cadence, market windows, execution pace
7. Direction Drivers — long-term strategy, growth path, where the organisation is headed

CORRECTION PROTOCOLS AVAILABLE:
${correctionProtocols.map((p: string, i: number) => `${i + 1}. ${p}`).join("\n")}

DRIVER CONTEXT SPECIFIC TO THIS MODULE:
${driverContext}

RULES:
- All assessments must be SPECIFIC to the enterprise context provided, not generic
- Use real-world enterprise consulting language
- Scores must be justified by the context provided
- Signals must be specific, not vague
- Actions must be immediately actionable
- Return ONLY valid JSON — no markdown, no code fences, no commentary outside JSON`;

    const userPrompt = `Run a full ${engineName} assessment for the following enterprise:

ENTERPRISE CONTEXT:
• Organisation: ${context.organisationName}
• Industry: ${context.industry || "Not specified"}
• Organisation Size: ${context.size || "Not specified"}
• Primary Challenge: ${context.challenge || "Not specified"}
• Strategic Goal: ${context.goal || "Not specified"}
• Additional Context: ${context.additionalContext || "None provided"}
${measuredData ? `
MEASURED PERFORMANCE DATA (already computed — do not recalculate):
${measuredData}

Ground every score, signal, and KPI in these figures. Cite the actual numbers.
Where the data contradicts a common assumption, say so explicitly.` : ""}

Generate a complete intelligence assessment. Return this exact JSON structure:

{
  "executiveSummary": "2-3 sentences specific to this enterprise's situation in this intelligence dimension. Be direct and insightful.",

  "kpis": [
    { "label": "metric name", "value": "specific value with unit", "trend": "1 sentence explaining this specific result" },
    { "label": "metric name", "value": "specific value with unit", "trend": "1 sentence explaining this specific result" },
    { "label": "metric name", "value": "specific value with unit", "trend": "1 sentence explaining this specific result" },
    { "label": "metric name", "value": "specific value with unit", "trend": "1 sentence explaining this specific result" }
  ],

  "signals": [
    { "severity": "High", "title": "specific finding about this enterprise", "action": "specific, immediately actionable recommendation" },
    { "severity": "Medium", "title": "specific finding about this enterprise", "action": "specific, immediately actionable recommendation" },
    { "severity": "Low", "title": "specific finding about this enterprise", "action": "specific, immediately actionable recommendation" }
  ],

  "dimensions": [
    { "label": "${dimensionLabels[0] || "Dimension 1"}", "value": <0-100>, "insight": "1 sentence specific to this enterprise" },
    { "label": "${dimensionLabels[1] || "Dimension 2"}", "value": <0-100>, "insight": "1 sentence specific to this enterprise" },
    { "label": "${dimensionLabels[2] || "Dimension 3"}", "value": <0-100>, "insight": "1 sentence specific to this enterprise" },
    { "label": "${dimensionLabels[3] || "Dimension 4"}", "value": <0-100>, "insight": "1 sentence specific to this enterprise" }
  ],

  "distortionIndex": "Low|Medium|High",
  "correctionPriority": "name of the most urgent correction protocol for this enterprise",
  "correctionReason": "1 sentence explaining why this correction is the priority",

  "thirtyDayPlan": [
    "specific action for this enterprise in the next 30 days",
    "specific action for this enterprise in the next 30 days",
    "specific action for this enterprise in the next 30 days"
  ],

  "ninetyDayPlan": [
    "specific action for this enterprise in the 30-90 day window",
    "specific action for this enterprise in the 30-90 day window",
    "specific action for this enterprise in the 30-90 day window"
  ]
}`;

    const response = await client().chat.completions.create({
      model:       "anthropic/claude-sonnet-4-6",
      temperature: 0.65,
      max_tokens:  2000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt },
      ],
    });

    const raw     = response.choices[0]?.message?.content ?? "{}";
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error(`[Intelligence] ${moduleId}: model returned non-JSON`);
      return NextResponse.json(
        { message: "The assessment came back malformed. Please run it again." },
        { status: 502 }
      );
    }

    // Repair recoverable drift; reject output too broken to display.
    const outcome = validateIntelligenceResult(parsed, dimensionLabels);
    if (!outcome.ok || !outcome.result) {
      console.error(`[Intelligence] ${moduleId}: ${outcome.reason}`);
      return NextResponse.json(
        { message: "The assessment came back incomplete. Please run it again." },
        { status: 502 }
      );
    }
    if (outcome.repaired.length) {
      console.warn(`[Intelligence] ${moduleId}: repaired ${outcome.repaired.join(", ")}`);
    }

    return NextResponse.json({ result: outcome.result, moduleId, engineName });

  } catch (error) {
    console.error("Intelligence API error:", error);
    return NextResponse.json({ message: "Failed to generate intelligence assessment." }, { status: 500 });
  }
}
