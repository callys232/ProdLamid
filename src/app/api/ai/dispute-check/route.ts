import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import connectDB from "@/lib/db";
import { Milestone } from "@/lib/models/Milestone";
import { Project } from "@/lib/models/Project";
import { Notification } from "@/lib/models/Notification";
import { rateLimit } from "@/lib/rateLimit";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey:  process.env.OPENROUTER_API_KEY ?? "",
  defaultHeaders: {
    "HTTP-Referer": "https://lamidconsulting.com",
    "X-Title":      "LAMID Escrow AI – Dispute Arbitration",
  },
});

interface DisputeCheckResult {
  verdict: "valid" | "invalid";
  confidence: number;
  reasoning: string;
  recommendation: "release_funds" | "hold_for_review";
}

// POST /api/ai/dispute-check
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const limit = await rateLimit(`ai-dispute-check:${ip}`, { windowMs: 60_000, max: 10 });
    if (!limit.allowed) {
      return NextResponse.json({ success: false, message: "Rate limit exceeded" }, { status: 429 });
    }

    await connectDB();

    const body = await request.json();
    const {
      milestoneId,
      projectId,
      disputeReason,
      clientFileUrl,
    }: {
      milestoneId: string;
      projectId: string;
      disputeReason: string;
      clientFileUrl?: string;
    } = body;

    if (!milestoneId || !projectId || !disputeReason) {
      return NextResponse.json(
        { success: false, message: "milestoneId, projectId, and disputeReason are required" },
        { status: 400 }
      );
    }

    const [milestone, project] = await Promise.all([
      Milestone.findById(milestoneId).lean() as any,
      Project.findById(projectId).lean() as any,
    ]);

    if (!milestone) {
      return NextResponse.json({ success: false, message: "Milestone not found" }, { status: 404 });
    }
    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    const prompt = `You are LAMID Escrow AI — an AI arbitration agent. A client has disputed a milestone that was previously AI-certified.

MILESTONE: ${milestone.title}
REQUIREMENTS: ${milestone.description}
ACCEPTANCE CRITERIA: ${milestone.acceptanceCriteria || milestone.description}

ORIGINAL CERTIFICATION (Score: ${milestone.aiCertificationScore}/100):
${milestone.aiCertificationReport}

CONSULTANT'S DELIVERY NOTES:
${milestone.deliverableNotes}

CLIENT DISPUTE REASON:
"${disputeReason}"
${clientFileUrl ? `\nCLIENT EVIDENCE FILE: ${clientFileUrl}` : ""}

Evaluate: does the client's dispute identify real gaps not caught in certification, or are the deliverables genuinely complete?

Return ONLY valid JSON:
{
  "verdict": "valid" | "invalid",
  "confidence": number (0-100),
  "reasoning": "Clear explanation",
  "recommendation": "release_funds" | "hold_for_review"
}

verdict "valid" = client is correct, work is insufficient
verdict "invalid" = client dispute is not justified, work meets requirements`;

    const completion = await openai.chat.completions.create({
      model: "anthropic/claude-sonnet-4-5",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const result: DisputeCheckResult = JSON.parse(raw);

    const now = new Date();
    const consultantId = project.consultants?.[0];

    if (result.verdict === "invalid") {
      // Dispute overruled — restore certification, set shorter auto-release (2 hours)
      const newAutoReleaseAt = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      await Milestone.findByIdAndUpdate(milestoneId, {
        $set: {
          aiDisputeVerdict: "invalid",
          aiDisputeReport:  result.reasoning,
          status:           "ai_certified",
          aiAutoReleaseAt:  newAutoReleaseAt,
        },
      });

      // Notify client — dispute overruled
      if (project.ownerId) {
        await Notification.create({
          user:        project.ownerId,
          title:       "AI Arbitration: Dispute Not Supported",
          message:     `AI arbitration found your dispute for milestone "${milestone.title}" is not supported by evidence. The deliverables meet the stated requirements. Funds will auto-release in 2 hours. Reasoning: ${result.reasoning}`,
          type:        "alert",
          severity:    "High",
          relatedId:   String(milestoneId),
          relatedType: "project",
          read:        false,
        });
      }

      // Notify consultant — dispute overruled in their favour
      if (consultantId) {
        await Notification.create({
          user:        consultantId,
          title:       "Client Dispute Overruled by AI",
          message:     `The client's dispute for milestone "${milestone.title}" was reviewed and overruled by AI. Your deliverables have been confirmed as meeting requirements. Funds will auto-release in 2 hours.`,
          type:        "alert",
          severity:    "High",
          relatedId:   String(milestoneId),
          relatedType: "project",
          read:        false,
        });
      }
    } else {
      // Verdict "valid" — client is right, keep in dispute
      await Milestone.findByIdAndUpdate(milestoneId, {
        $set: {
          aiDisputeVerdict: "valid",
          aiDisputeReport:  result.reasoning,
          status:           "dispute",
        },
      });

      // Notify consultant — must address issues
      if (consultantId) {
        await Notification.create({
          user:        consultantId,
          title:       "AI Dispute Review: Action Required",
          message:     `AI reviewed the client's dispute for milestone "${milestone.title}" and found it valid. Please address the following: ${result.reasoning}`,
          type:        "alert",
          severity:    "High",
          relatedId:   String(milestoneId),
          relatedType: "project",
          read:        false,
        });
      }

      // Notify client — dispute confirmed
      if (project.ownerId) {
        await Notification.create({
          user:        project.ownerId,
          title:       "AI Confirmed Your Dispute",
          message:     `AI has confirmed your dispute for milestone "${milestone.title}". The consultant has been notified to address the identified issues. Reasoning: ${result.reasoning}`,
          type:        "alert",
          severity:    "High",
          relatedId:   String(milestoneId),
          relatedType: "project",
          read:        false,
        });
      }
    }

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("[AI dispute-check]", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
