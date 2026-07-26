import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { rateLimit } from "@/lib/rateLimit";
import { sanitiseInput, isBodyTooLarge, getClientIP } from "@/lib/sanitize";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "@/lib/jwt";

const client = () =>
  new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "https://lamidconsulting.com",
      "X-Title": "Lamid Consulting – Business Diagnostic",
    },
  });

const SYSTEM_PROMPT = `You are a Senior Partner at Lamid Consulting — a global management consulting firm with deep expertise across strategy, operations, HR, technology, and sustainable development. You have conducted hundreds of business diagnostics for companies ranging from early-stage startups to listed corporates across every major market.

Your diagnostic assessments are known for:
- Brutally honest yet constructive scoring across 7 business dimensions
- Specific, evidence-backed insights (not generic advice)
- Actionable recommendations calibrated to the business's stage and context
- Deep understanding of market dynamics, regulatory environments, and growth challenges in the region the client operates in
- Connecting business health indicators to Lamid's specific service offerings

You MUST return ONLY valid JSON — no markdown, no code fences, no commentary outside the JSON object.`;

export async function POST(req: NextRequest) {
  if (isBodyTooLarge(req)) {
    return NextResponse.json({ message: "Request too large." }, { status: 413 });
  }
  /* ── Rate limiting: 15/day for auth users by userId, 5/day for anon by IP ── */
  const ip = getClientIP(req);

  // Resolve authenticated user ID from JWT cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let userId: string | null = null;
  if (token) {
    try {
      const decoded: any = jwt.verify(token, getJwtSecret());
      userId = decoded.userId;
    } catch {}
  }

  const key = userId ?? ip;
  const maxRequests = userId ? 15 : 5;
  const limit = await rateLimit(`diagnose:${key}`, { windowMs: 24 * 60 * 60_000, max: maxRequests });
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Daily diagnostic limit reached. Sign in for higher limits or try again tomorrow." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset":     String(limit.resetAt),
          "Retry-After":           String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  try {
    const body  = await req.json();
    const raw   = sanitiseInput(body.formData ?? body);

    const businessName   = raw.businessName   || raw.fullname  || "the business";
    const industry       = raw.industry       || raw.eventCategory || "";
    const stage          = raw.stage          || "";
    const yearsInOp      = raw.yearsInOperation || "";
    const teamSize       = raw.teamSize        || "";
    const revenueRange   = raw.revenueRange    || "";
    const primaryMarket  = raw.primaryMarket   || (raw.city ? `${raw.city}, ${raw.state || ""}` : "");
    const challenges     = raw.challenges      || (Array.isArray(raw.checkboxes) ? raw.checkboxes.join(", ") : "");
    const goals          = raw.goals           || "";
    const businessStrengths = raw.strengths    || "";
    const motivation     = raw.motivation      || JSON.stringify(raw.tableData || "");

    const prompt = `Conduct a comprehensive business diagnostic for the following organisation. Be specific, insightful, and honest — calibrate your scores to real-world benchmarks for a business at this stage and in this market. Every score must be justified by the data provided.

BUSINESS PROFILE:
• Business: ${businessName}
• Industry / Sector: ${industry || "Not specified"}
• Business Stage: ${stage || "Not specified"}
• Years in Operation: ${yearsInOp || "Not specified"}
• Team Size: ${teamSize || "Not specified"}
• Annual Revenue Range: ${revenueRange || "Not specified"}
• Primary Market: ${primaryMarket || "Not specified"}

CONTEXT:
• Key Challenges: ${challenges || "Not provided"}
• Strategic Goals: ${goals || "Not provided"}
• Current Strengths: ${businessStrengths || "Not provided"}
• Motivation for Diagnostic: ${motivation || "Not provided"}

Return this exact JSON structure. Every field is REQUIRED. Every array must have the minimum items specified:

{
  "overallScore": <integer 0-100 based on weighted average of 7 dimension scores>,
  "healthGrade": "<A+|A|A-|B+|B|B-|C+|C|C-|D|F>",
  "headline": "<one compelling sentence that precisely captures this business's current position>",
  "executiveSummary": "<2-3 rich paragraphs. Open with the business's biggest opportunity. Middle: the critical constraint holding it back. Close: the transformation possible with the right interventions.>",

  "dimensions": [
    { "name": "Strategy & Vision",          "score": <0-100>, "status": "<strong|moderate|weak|critical>", "insight": "<2-3 sentences>", "quickWins": ["<win 1>", "<win 2>"] },
    { "name": "Operations & Processes",     "score": <0-100>, "status": "<strong|moderate|weak|critical>", "insight": "<2-3 sentences>", "quickWins": ["<win 1>", "<win 2>"] },
    { "name": "Finance & Revenue",          "score": <0-100>, "status": "<strong|moderate|weak|critical>", "insight": "<2-3 sentences>", "quickWins": ["<win 1>", "<win 2>"] },
    { "name": "Human Capital & Culture",    "score": <0-100>, "status": "<strong|moderate|weak|critical>", "insight": "<2-3 sentences>", "quickWins": ["<win 1>", "<win 2>"] },
    { "name": "Technology & Digital",       "score": <0-100>, "status": "<strong|moderate|weak|critical>", "insight": "<2-3 sentences>", "quickWins": ["<win 1>", "<win 2>"] },
    { "name": "Market & Competitive Position","score": <0-100>, "status": "<strong|moderate|weak|critical>", "insight": "<2-3 sentences>", "quickWins": ["<win 1>", "<win 2>"] },
    { "name": "Risk & Compliance",          "score": <0-100>, "status": "<strong|moderate|weak|critical>", "insight": "<2-3 sentences>", "quickWins": ["<win 1>", "<win 2>"] }
  ],

  "strengths": ["<4-6 specific strengths with brief justification>"],

  "criticalGaps": [
    { "gap": "<short specific name>", "impact": "<why this is holding the business back>", "urgency": "<high|medium|low>" }
  ],

  "recommendations": [
    { "title": "<short title>", "description": "<2-3 sentences of specific actionable guidance>", "effort": "<low|medium|high>", "impact": "<low|medium|high>", "timeframe": "<0-30 days|30-90 days|3-6 months|6-12 months>" }
  ],

  "actionPlan": {
    "thirtyDays": ["<3-4 immediately actionable items>"],
    "ninetyDays": ["<3-4 items for 30-90 day window>"],
    "sixMonths": ["<3-4 strategic initiatives>"]
  },

  "recommendedServices": [
    { "service": "<BIZ|HCD|SDC|Marketplace>", "name": "<full service name>", "reason": "<1-2 sentences connecting this service to this business's specific needs>" }
  ],

  "benchmarkInsight": "<1-2 sentences comparing this business to similar-stage companies in its own market and sector>",

  "callToAction": "<A compelling 2-3 sentence close with a specific Lamid next step and statement of confidence.>"
}

Minimum array sizes: dimensions=7, strengths=4, criticalGaps=2, recommendations=4, actionPlan each=3, recommendedServices=2.`;

    const response = await client().chat.completions.create({
      model: "anthropic/claude-sonnet-4-6",
      temperature: 0.6,
      max_tokens: 4500,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: prompt },
      ],
    });

    const raw2    = response.choices[0]?.message?.content ?? "{}";
    const cleaned = raw2.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const report  = JSON.parse(cleaned);

    // Inject backward-compatible legacy fields so DiagnosticReport.jsx still works
    report.summary                  = report.executiveSummary?.split(/\.\s+/)[0] + "." || report.headline;
    report.recommendedService       = report.recommendedServices?.[0]?.service ?? "BIZ";
    report.recommendedServiceReason = report.recommendedServices?.[0]?.reason ?? "";
    report.challenges               = (report.criticalGaps ?? []).slice(0, 3).map((g: { gap: string }) => g.gap);
    report.nextStep                 = report.callToAction?.split(/\.\s+/)[0] + "." || "";

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Diagnostic AI error:", error);
    return NextResponse.json({ message: "Failed to generate diagnostic." }, { status: 500 });
  }
}
