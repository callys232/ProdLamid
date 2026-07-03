import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { rateLimit } from "@/lib/rateLimit";
import { sanitiseInput, isBodyTooLarge, getClientIP } from "@/lib/sanitize";

const client = () =>
  new OpenAI({
    apiKey:  process.env.OPENROUTER_API_KEY ?? "",
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "https://lamidconsulting.com",
      "X-Title":      "Lamid Consulting – Proposal Drafter",
    },
  });

const SYSTEM_PROMPT = `You are a Principal Consultant and award-winning proposal writer at Lamid Consulting — an elite pan-African management consulting firm. You have 20+ years of experience crafting winning proposals for Fortune 500s, governments, NGOs, and high-growth companies across Africa and globally.

Your proposals are known for:
- Precise diagnosis of client pain points backed by industry data
- Concrete, phased delivery methodologies
- Measurable KPIs and success metrics in every section
- Commercial language that builds urgency and confidence
- Impeccable structure that mirrors top-tier McKinsey/Bain style

You MUST return ONLY valid JSON — no markdown, no code fences, no commentary outside the JSON object.`;

export async function POST(req: NextRequest) {
  if (isBodyTooLarge(req)) {
    return NextResponse.json({ message: "Request too large." }, { status: 413 });
  }
  /* ── Rate limiting: 10 proposals per IP per 24 hours ── */
  const ip    = getClientIP(req);
  const limit = await rateLimit(`proposal:${ip}`, { windowMs: 24 * 60 * 60_000, max: 10 });
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Daily proposal limit reached. Sign in for higher limits or try again tomorrow." },
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
    const clean = sanitiseInput(await req.json());
    const { projectTitle, clientName, companyName, category, description, timeline } = clean;
    const budget       = clean.budget;
    const skills       = clean.skills;
    const deliverables = clean.deliverables;

    if (!projectTitle?.trim())
      return NextResponse.json({ message: "Project title required." }, { status: 400 });

    const prompt = `Generate an exceptionally detailed, client-ready consulting proposal for the following engagement. Use specific, persuasive language tailored to the category and context. Include measurable KPIs, industry benchmarks where relevant, and a tone that inspires confidence and urgency.

ENGAGEMENT BRIEF:
• Title: ${projectTitle}
• Client: ${clientName || "Valued Client"} at ${companyName || "the client organisation"}
• Category: ${category || "Management Consulting"}
• Context: ${description || "A strategic consulting engagement to drive measurable business improvement"}
• Core Skills: ${Array.isArray(skills) ? skills.join(", ") : skills || "consulting, analysis, strategy"}
• Key Deliverables requested: ${Array.isArray(deliverables) ? deliverables.join(", ") : deliverables || "to be scoped during discovery"}
• Investment envelope: ${budget ? `$${budget.toLocaleString()}` : "to be confirmed"}
• Desired timeline: ${timeline || "to be agreed"}

Return this JSON structure — every field is REQUIRED, every array must have at least 3 items:

{
  "executiveSummary": "3 rich paragraphs. Open with a compelling hook about the client's opportunity/challenge. Middle paragraph: how Lamid's unique approach addresses it. Close: the tangible business outcome the client will achieve. Use specific numbers and outcomes where possible.",

  "problemStatement": "1–2 paragraphs. Name the specific pain, risk, or missed opportunity facing the client. Reference industry trends, data points, or common benchmarks to validate the urgency. Show empathy and deep sector knowledge.",

  "proposedApproach": "3 paragraphs. Paragraph 1: Lamid's overall methodology (discovery, design, delivery). Paragraph 2: How we tailor this framework specifically to the client's context. Paragraph 3: What makes our approach different from generic consultants — proprietary tools, practitioner-led delivery, embedded transfer of capability.",

  "scope": {
    "included": ["5–7 specific, actionable items that are explicitly in scope — be precise, not generic"],
    "excluded": ["3–5 items explicitly out of scope with brief reason — sets professional expectations"]
  },

  "deliverables": ["6–8 specific, named deliverables — e.g. 'Capability Assessment Report with gap analysis and scoring matrix' not just 'assessment report'"],

  "kpis": ["4–6 measurable success metrics with targets — e.g. '20% improvement in team productivity measured via OKR scorecard within 90 days'"],

  "timeline": [
    {
      "phase": "Phase name (e.g. Discovery & Diagnosis)",
      "duration": "e.g. Weeks 1–2",
      "activities": "Specific activities in this phase — at least 3 activities listed",
      "milestone": "The key deliverable or decision gate at the end of this phase"
    }
  ],

  "investment": {
    "total": "${budget ? `$${Number(budget).toLocaleString()}` : "Subject to final scoping"}",
    "breakdown": [
      { "item": "Specific service line or cost category", "cost": "Amount or % of total", "note": "Brief justification" }
    ],
    "paymentTerms": "Specific payment schedule — e.g. 30% on signing, 40% at mid-point milestone, 30% on final delivery",
    "roi": "1–2 sentences on the expected ROI or value created relative to the investment"
  },

  "whyLamid": [
    {
      "point": "Short title of differentiator",
      "detail": "2–3 sentences expanding on why this matters specifically for this client and engagement"
    }
  ],

  "risksMitigations": [
    { "risk": "Specific implementation risk", "mitigation": "How Lamid proactively manages or eliminates it" }
  ],

  "terms": ["4–5 clear, professional terms and conditions — IP ownership, confidentiality, change management, cancellation"],

  "callToAction": "A compelling 2–3 sentence closing paragraph that creates momentum. Reference a specific next step (e.g. 'We recommend a 60-minute scoping call this week to align on priorities and confirm the engagement structure.') End with a statement of confidence and partnership."
}`;

    const response = await client().chat.completions.create({
      model:       "anthropic/claude-sonnet-4-6",
      temperature: 0.65,
      max_tokens:  4000,
      messages: [
        { role: "system",  content: SYSTEM_PROMPT },
        { role: "user",    content: prompt },
      ],
    });

    const raw     = response.choices[0]?.message?.content ?? "{}";
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const proposal = JSON.parse(cleaned);

    return NextResponse.json({ proposal });
  } catch (error) {
    console.error("Proposal AI error:", error);
    return NextResponse.json({ message: "Failed to generate proposal." }, { status: 500 });
  }
}
