import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

interface SimilarProject {
  title: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  durationWeeks: number;
  platform: string;
  skills: string[];
  notes: string;
}

interface BenchmarkResponse {
  similarProjects: SimilarProject[];
  marketInsights: {
    avgBudget: number;
    avgDurationWeeks: number;
    rateRange: string;
    demandLevel: "low" | "medium" | "high";
    topPlatforms: string[];
  };
  recommendations: string[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessType, complexity, timeline, category, title, skills, description } = body;

    const prompt = `You are a project cost research analyst with access to real-world freelance marketplace data from Upwork, Toptal, Fiverr, PeoplePerHour, Freelancer.com, and industry benchmarks.

A client is planning a project with these details:
- Category: ${category ?? "Software / Consulting"}
- Title / Scope: ${title ?? "Not specified"}
- Business Type: ${businessType ?? "startup"}
- Complexity: ${complexity ?? "medium"}
- Skills Required: ${skills?.join(", ") ?? "Not specified"}
- Duration: ${timeline?.durationWeeks ?? "unknown"} weeks, ${timeline?.milestones ?? "unknown"} milestones
- Description: ${description ?? "Not provided"}

Based on REAL market data from 2024–2025, provide:

1. Five similar real-world projects with actual budget ranges from freelance platforms
2. Market insights including average rates, demand levels, and top platforms for this type of work
3. Three actionable budget recommendations

Return ONLY a JSON object matching this exact structure:
{
  "similarProjects": [
    {
      "title": "string (specific project title from real market)",
      "category": "string",
      "budgetMin": number,
      "budgetMax": number,
      "durationWeeks": number,
      "platform": "string (e.g. Upwork, Toptal, Fiverr)",
      "skills": ["string"],
      "notes": "string (1 sentence about this project type)"
    }
  ],
  "marketInsights": {
    "avgBudget": number,
    "avgDurationWeeks": number,
    "rateRange": "string (e.g. $50–150/hr)",
    "demandLevel": "low|medium|high",
    "topPlatforms": ["string"]
  },
  "recommendations": ["string", "string", "string"]
}

Use real 2024–2025 market rates. Be specific and accurate. Return only valid JSON.`;

    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a project cost analyst. You provide precise, data-driven budget benchmarks based on real freelance marketplace data. Always return valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    const data: BenchmarkResponse = JSON.parse(content);

    // Validate structure — fall back gracefully
    if (!data.similarProjects || !Array.isArray(data.similarProjects)) {
      throw new Error("Invalid AI response structure");
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Estimate similar error:", error);

    // Return sensible fallback so the estimator still renders
    return NextResponse.json({
      success: false,
      message: "Could not fetch live benchmarks",
      data: {
        similarProjects: [
          { title: "SaaS Dashboard Build",      category: "Technology & Software",  budgetMin: 8000,  budgetMax: 25000, durationWeeks: 12, platform: "Upwork",    skills: ["React", "Node.js"],           notes: "Common mid-market SaaS project." },
          { title: "Brand Identity Package",    category: "Design & Creative",      budgetMin: 3000,  budgetMax: 10000, durationWeeks: 4,  platform: "Fiverr Pro", skills: ["Figma", "Branding"],          notes: "Full identity kits for startups." },
          { title: "Fractional CFO Engagement", category: "Finance & Accounting",   budgetMin: 15000, budgetMax: 40000, durationWeeks: 16, platform: "Toptal",    skills: ["Financial Modelling", "M&A"], notes: "Part-time CFO for Series A companies." },
          { title: "Digital Marketing Strategy",category: "Marketing & Growth",     budgetMin: 4000,  budgetMax: 12000, durationWeeks: 8,  platform: "Upwork",    skills: ["SEO", "Paid Ads"],            notes: "Multi-channel growth campaigns." },
          { title: "Data Warehouse Setup",      category: "Data & Analytics",       budgetMin: 10000, budgetMax: 30000, durationWeeks: 10, platform: "Toptal",    skills: ["dbt", "Snowflake"],           notes: "Modern data stack implementations." },
        ],
        marketInsights: {
          avgBudget: 15000,
          avgDurationWeeks: 10,
          rateRange: "$50–200/hr",
          demandLevel: "high",
          topPlatforms: ["Upwork", "Toptal", "Fiverr Pro"],
        },
        recommendations: [
          "Set an escrow-backed milestone structure to reduce payment risk.",
          "Budget 15–20% contingency for scope changes.",
          "Prioritise consultants with verified reviews and completed projects in your category.",
        ],
      },
    });
  }
}
