import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { deductPoints, POINT_COSTS } from "@/lib/services/pointsService";
import { rateLimit } from "@/lib/rateLimit";

const getClient = () =>
  new OpenAI({
    apiKey:  process.env.OPENROUTER_API_KEY ?? "",
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "https://lamidconsulting.com",
      "X-Title":      "LAMID TALENT — Capability Diagnostics",
    },
  });

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const pointsResult = await deductPoints(auth.userId, POINT_COSTS.AI_CAPABILITY_DIAGNOSTIC, "Capability Diagnostic");
  if (!pointsResult.success) {
    return NextResponse.json(
      { success: false, message: pointsResult.message, code: "INSUFFICIENT_POINTS", balance: pointsResult.balance },
      { status: 402 }
    );
  }

  const rl = await rateLimit(`talent:capability:${auth.userId}`, { windowMs: 60 * 60_000, max: 10 });
  if (!rl.allowed) {
    return NextResponse.json({ message: "Rate limit reached. Try again later." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { role, industry, yearsExperience, skills, goals } = body;

    if (!role || !skills?.length || !goals) {
      return NextResponse.json({ message: "role, skills, and goals are required." }, { status: 400 });
    }

    const skillList = (skills as Array<{ name: string; currentLevel: number; targetLevel: number }>)
      .map(s => `- ${s.name}: current ${s.currentLevel}/5, target ${s.targetLevel}/5`)
      .join("\n");

    const prompt = `You are a senior talent development advisor at LAMID TALENT. Run a Capability Diagnostic assessment for this professional.

PROFESSIONAL PROFILE:
- Role: ${role}
- Industry: ${industry || "Not specified"}
- Years of Experience: ${yearsExperience || "Not specified"}
- Career Goals: ${goals}

SELF-ASSESSED SKILLS:
${skillList}

Generate a precise capability diagnostic. Return ONLY this JSON structure:

{
  "overallScore": <0-100 integer>,
  "readinessLevel": "Foundational" | "Developing" | "Proficient" | "Advanced" | "Expert",
  "executiveSummary": "2-3 sentences specific to this professional's capability profile",
  "skillScores": [
    { "skill": "skill name", "score": <0-100>, "gap": <0-100 gap size>, "priority": "High" | "Medium" | "Low", "insight": "one specific insight" }
  ],
  "topGaps": [
    { "skill": "skill name", "insight": "why this gap matters for their role and goals", "action": "specific, immediately actionable development step" }
  ],
  "strengths": ["2-3 specific strengths worth leveraging"],
  "thirtyDayPlan": ["3 specific, actionable development activities for the next 30 days"],
  "ninetyDayPlan": ["3 specific, actionable development activities for 30-90 days"],
  "recommendedRoles": ["2-3 roles this professional is well-suited for given their trajectory"]
}

Focus on topGaps — pick the top 3 skill gaps with the highest impact on achieving their stated goals. All scores must be derived from the self-assessment data. Return ONLY valid JSON.`;

    const response = await getClient().chat.completions.create({
      model:       "anthropic/claude-sonnet-4-6",
      temperature: 0.5,
      max_tokens:  1800,
      messages: [{ role: "user", content: prompt }],
    });

    const raw     = response.choices[0]?.message?.content ?? "{}";
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const result  = JSON.parse(cleaned);

    return NextResponse.json({ success: true, result });
  } catch (e: any) {
    console.error("Capability diagnostics error:", e);
    return NextResponse.json({ success: false, message: "Failed to generate capability assessment." }, { status: 500 });
  }
}
