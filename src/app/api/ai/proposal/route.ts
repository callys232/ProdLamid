import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: NextRequest) {
  try {
    const { projectTitle, clientName, description, budget, timeline, category, skills, deliverables, companyName } = await req.json();

    if (!projectTitle) return NextResponse.json({ message: "Project title required." }, { status: 400 });

    const prompt = `You are a senior consultant at Lamid Consulting writing a professional project proposal. Generate a comprehensive, client-ready proposal document.

Project Details:
- Project Title: ${projectTitle}
- Client Name: ${clientName || "Valued Client"}
- Company: ${companyName || "Not specified"}
- Category: ${category || "Consulting"}
- Description: ${description || "General consulting engagement"}
- Skills Required: ${(skills || []).join(", ") || "To be determined"}
- Requested Deliverables: ${(deliverables || []).join(", ") || "To be scoped"}
- Budget: ${budget ? `$${budget}` : "To be discussed"}
- Timeline: ${timeline || "To be agreed"}

Generate a JSON response with this structure:
{
  "executiveSummary": "2-3 paragraph professional summary",
  "problemStatement": "What problem or opportunity this project addresses (1 paragraph)",
  "proposedApproach": "How Lamid will approach the project (2 paragraphs)",
  "scope": {
    "included": ["list of what is included"],
    "excluded": ["list of what is explicitly excluded"]
  },
  "deliverables": ["list of specific deliverables"],
  "timeline": [
    { "phase": "Phase name", "duration": "e.g. 2 weeks", "activities": "Key activities" }
  ],
  "investment": {
    "total": "${budget || "To be agreed"}",
    "breakdown": [
      { "item": "Service item", "cost": "Amount or percentage" }
    ],
    "paymentTerms": "Payment schedule description"
  },
  "whyLamid": ["3-4 reasons why Lamid is the right partner"],
  "terms": ["3-4 standard terms and conditions"],
  "callToAction": "Closing statement and next steps"
}

Be professional, specific, and persuasive. Return ONLY valid JSON.`;

    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content || "{}";
    const proposal = JSON.parse(content);
    return NextResponse.json({ proposal });
  } catch (error) {
    console.error("Proposal AI error:", error);
    return NextResponse.json({ message: "Failed to generate proposal." }, { status: 500 });
  }
}
