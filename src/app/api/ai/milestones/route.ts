import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: NextRequest) {
  try {
    const { title, description, category, skills, budget, timeline } = await req.json();

    if (!title) return NextResponse.json({ message: "Project title required." }, { status: 400 });

    const prompt = `You are an AI Project Manager for Lamid Consulting. Generate a structured milestone plan for the following project.

Project Details:
- Title: ${title}
- Category: ${category || "General Consulting"}
- Description: ${description || "No description provided"}
- Required Skills: ${(skills || []).join(", ") || "Not specified"}
- Budget: ${budget ? `$${budget}` : "Not specified"}
- Timeline: ${timeline || "Not specified"}

Return a JSON object with this structure:
{
  "phases": [
    {
      "name": "Phase name",
      "duration": "e.g. 1 week",
      "milestones": [
        {
          "title": "Milestone title",
          "description": "What gets delivered",
          "durationDays": 5,
          "payment_percentage": 25,
          "acceptance_criteria": "How to verify completion"
        }
      ]
    }
  ],
  "totalDurationWeeks": 6,
  "riskFlags": ["Any risks identified"],
  "recommendations": "One sentence of advice for successful delivery"
}

Generate 3-5 phases with 1-3 milestones each. Distribute payment percentages to total 100%. Return ONLY valid JSON.`;

    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content || "{}";
    const plan = JSON.parse(content);
    return NextResponse.json({ plan });
  } catch (error) {
    console.error("AI Milestones error:", error);
    return NextResponse.json({
      plan: {
        phases: [
          {
            name: "Discovery & Planning",
            duration: "1 week",
            milestones: [{ title: "Requirements gathering", description: "Define scope and deliverables", durationDays: 5, payment_percentage: 20, acceptance_criteria: "Approved project brief" }],
          },
          {
            name: "Execution",
            duration: "3 weeks",
            milestones: [{ title: "Core delivery", description: "Main project work completed", durationDays: 21, payment_percentage: 60, acceptance_criteria: "Deliverable reviewed and approved" }],
          },
          {
            name: "Closure",
            duration: "1 week",
            milestones: [{ title: "Final handover", description: "Documentation and sign-off", durationDays: 5, payment_percentage: 20, acceptance_criteria: "Client sign-off received" }],
          },
        ],
        totalDurationWeeks: 5,
        riskFlags: ["Scope creep", "Communication delays"],
        recommendations: "Maintain weekly check-ins to ensure alignment throughout delivery.",
      },
    });
  }
}
