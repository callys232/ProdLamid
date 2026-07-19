import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { requireAuth } from "@/lib/middleware/auth";
import { rateLimit } from "@/lib/rateLimit";

const getClient = () =>
  new OpenAI({
    apiKey:  process.env.OPENROUTER_API_KEY ?? "",
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "https://lamidconsulting.com",
      "X-Title":      "LAMID TALENT — Workforce Analytics",
    },
  });

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const rl = await rateLimit(`talent:workforce:${auth.userId}`, { windowMs: 60 * 60_000, max: 10 });
  if (!rl.allowed) {
    return NextResponse.json({ message: "Rate limit reached. Try again later." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { orgName, industry, teamSize, departments, currentSkills, skillGaps, strategicPriorities, challenge } = body;

    if (!orgName || !teamSize) {
      return NextResponse.json({ message: "orgName and teamSize are required." }, { status: 400 });
    }

    const prompt = `You are a senior workforce analytics advisor at LAMID TALENT. Run a Workforce Analytics assessment for the following organisation.

ORGANISATION:
- Name: ${orgName}
- Industry: ${industry || "Not specified"}
- Team Size: ${teamSize}
- Departments: ${(departments ?? []).join(", ") || "Not specified"}
- Current Skill Strengths: ${(currentSkills ?? []).join(", ") || "Not specified"}
- Identified Skill Gaps: ${(skillGaps ?? []).join(", ") || "Not specified"}
- Strategic Priorities: ${(strategicPriorities ?? []).join(", ") || "Not specified"}
- Primary Workforce Challenge: ${challenge || "Not specified"}

Generate a workforce analytics report. Return ONLY this JSON structure:

{
  "workforceHealthScore": <0-100 integer>,
  "skillCoverageScore": <0-100 integer>,
  "talentRiskScore": <0-100 integer, where 100 = highest risk>,
  "retentionRiskScore": <0-100 integer>,
  "executiveSummary": "2-3 sentences specific to this organisation's workforce situation",

  "kpis": [
    { "label": "metric name", "value": "specific value", "trend": "1-sentence explanation" },
    { "label": "metric name", "value": "specific value", "trend": "1-sentence explanation" },
    { "label": "metric name", "value": "specific value", "trend": "1-sentence explanation" },
    { "label": "metric name", "value": "specific value", "trend": "1-sentence explanation" }
  ],

  "signals": [
    { "severity": "High", "title": "specific workforce finding", "action": "specific, immediately actionable recommendation" },
    { "severity": "Medium", "title": "specific workforce finding", "action": "specific, immediately actionable recommendation" },
    { "severity": "Low", "title": "specific workforce finding", "action": "specific, immediately actionable recommendation" }
  ],

  "criticalGaps": [
    { "area": "skill or role area", "impact": "why this gap affects the organisation", "remedy": "specific solution" }
  ],

  "thirtyDayPlan": ["3 specific workforce actions for the next 30 days"],
  "ninetyDayPlan": ["3 specific workforce actions for 30-90 days"],

  "hiringRecommendations": ["2-3 specific roles or skill areas to prioritise hiring for"],
  "retentionActions": ["2-3 specific actions to retain top talent"]
}

Base all scores and insights on the specific data provided. Return ONLY valid JSON.`;

    const response = await getClient().chat.completions.create({
      model:       "anthropic/claude-sonnet-4-6",
      temperature: 0.55,
      max_tokens:  2000,
      messages: [{ role: "user", content: prompt }],
    });

    const raw     = response.choices[0]?.message?.content ?? "{}";
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const result  = JSON.parse(cleaned);

    return NextResponse.json({ success: true, result });
  } catch (e: any) {
    console.error("Workforce analytics error:", e);
    return NextResponse.json({ success: false, message: "Failed to generate workforce analysis." }, { status: 500 });
  }
}
