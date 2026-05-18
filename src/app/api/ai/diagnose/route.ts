import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const getClient = () => new OpenAI({ apiKey: process.env.OPENROUTER_API_KEY ?? "", baseURL: "https://openrouter.ai/api/v1" });

export async function POST(req: NextRequest) {
  try {
    const { formData } = await req.json();

    const prompt = `You are a Lamid Consulting business diagnostic AI. Analyse the following client submission and provide a structured diagnostic report.

Client Data:
- Name: ${formData.fullname || "Not provided"}
- Email: ${formData.email || "Not provided"}
- Location: ${formData.city || ""}, ${formData.state || ""}
- Event Category: ${formData.eventCategory || "General"}
- Business/Personal Description: ${JSON.stringify(formData.tableData || [])}
- Selected Interests/Challenges: ${(formData.checkboxes || []).join(", ") || "None selected"}

Provide a JSON response with:
{
  "summary": "2-sentence overall assessment",
  "strengths": ["up to 3 strengths identified"],
  "challenges": ["up to 3 key challenges"],
  "recommendations": [
    { "title": "short title", "description": "one sentence action" }
  ],
  "recommendedService": "one of: BIZ, HCD, SDC, Marketplace",
  "recommendedServiceReason": "one sentence why",
  "nextStep": "one clear call to action"
}

Return ONLY valid JSON.`;

    const response = await getClient().chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content || "{}";
    const report = JSON.parse(content);
    return NextResponse.json({ report });
  } catch (error) {
    console.error("Diagnostic AI error:", error);
    return NextResponse.json({
      report: {
        summary: "We received your submission and will follow up with a personalised diagnostic.",
        strengths: ["Proactive engagement", "Interest in growth"],
        challenges: ["Requires detailed review"],
        recommendations: [{ title: "Schedule a Consultation", description: "Book a free session with a Lamid consultant." }],
        recommendedService: "BIZ",
        recommendedServiceReason: "General business growth support fits most profiles.",
        nextStep: "Contact us at hq@lamidconsulting.com",
      },
    });
  }
}
