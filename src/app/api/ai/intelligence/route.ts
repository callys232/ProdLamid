import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { rateLimit } from "@/lib/rateLimit";
import { sanitiseInput, isBodyTooLarge, getClientIP } from "@/lib/sanitize";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
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

  const ip = getClientIP(req);

  // Resolve authenticated user ID from JWT cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let userId: string | null = null;
  if (token) {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET ?? "");
      userId = decoded.userId;
    } catch {}
  }

  // Server-side tier gate: authenticated free-tier users are blocked
  if (userId) {
    try {
      await connectDB();
      const user = await Users.findById(userId).select("tier subscriptionStatus role accountType").lean() as any;
      const isPremium =
        user?.tier === "premium" ||
        user?.tier === "enterprise" ||
        user?.subscriptionStatus === "active" ||
        user?.role === "admin" ||
        ["Enterprise", "Concierge", "Admin"].includes(user?.accountType ?? "");
      if (!isPremium) {
        return NextResponse.json(
          { message: "Premium subscription required. Upgrade your account to access the Intelligence Hub." },
          { status: 403 }
        );
      }
    } catch (tierErr) {
      console.error("[Intelligence] Tier check failed:", tierErr);
      return NextResponse.json({ message: "Service temporarily unavailable. Please try again." }, { status: 503 });
    }
  }

  // Authenticated users: 50/day by userId; anonymous: 20/day by IP
  const key = userId ?? ip;
  const maxRequests = userId ? 50 : 20;
  const limit = await rateLimit(`intelligence:${key}`, { windowMs: 24 * 60 * 60_000, max: maxRequests });
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

DRIVER FRAMEWORK (five universal drivers):
1. Identity Drivers — essence, spirit, field, domain
2. Market Drivers — demand cycles, customer pulse, competitive velocity
3. Cultural Drivers — team rhythm, leadership coherence, workforce pulse
4. Temporal Drivers — flow, resonance, pulse, apex, sovereign timing
5. Destiny Drivers — origin, source, crown, totality

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
    const result  = JSON.parse(cleaned);

    return NextResponse.json({ result, moduleId, engineName });

  } catch (error) {
    console.error("Intelligence API error:", error);
    return NextResponse.json({ message: "Failed to generate intelligence assessment." }, { status: 500 });
  }
}
