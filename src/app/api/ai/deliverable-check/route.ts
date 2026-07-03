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
    "X-Title":      "LAMID Escrow AI – Deliverable Verification",
  },
});

export interface DeliverableCheckResult {
  certified: boolean;
  score: number;
  summary: string;
  matched_requirements: string[];
  unmet_requirements: string[];
  recommendation: "release" | "hold";
  confidence: "high" | "medium" | "low";
}

/**
 * Core logic — exported so submit route can call it directly.
 */
export async function runDeliverableCheck(params: {
  milestoneId: string;
  projectId: string;
  deliverableUrls: string[];
  deliverableNotes: string;
}): Promise<DeliverableCheckResult> {
  const { milestoneId, projectId, deliverableUrls, deliverableNotes } = params;

  const [milestone, project] = await Promise.all([
    Milestone.findById(milestoneId).lean() as any,
    Project.findById(projectId).lean() as any,
  ]);

  if (!milestone) throw new Error("Milestone not found");
  if (!project)   throw new Error("Project not found");

  const prompt = `You are LAMID Escrow AI — an impartial AI verification agent for the LAMID ONE consulting platform. Your role is to determine whether a consultant's submitted deliverables meet the project milestone requirements.

MILESTONE TITLE: ${milestone.title}
MILESTONE DESCRIPTION: ${milestone.description}
ACCEPTANCE CRITERIA: ${milestone.acceptanceCriteria || milestone.description}

PROJECT CONTEXT: ${project.description || "Consulting engagement"}

CONSULTANT DELIVERY NOTES:
${deliverableNotes}

SUBMITTED FILES:
${deliverableUrls.map((url: string, i: number) => `File ${i + 1}: ${url}`).join("\n") || "No files listed"}

Evaluate whether the delivered work meets the milestone requirements. Return ONLY valid JSON:
{
  "certified": boolean,
  "score": number (0-100),
  "summary": "1-2 sentence verdict",
  "matched_requirements": ["list of what was correctly delivered"],
  "unmet_requirements": ["list of what is missing or doesn't meet spec"],
  "recommendation": "release" | "hold",
  "confidence": "high" | "medium" | "low"
}`;

  const completion = await openai.chat.completions.create({
    model: "anthropic/claude-sonnet-4-5",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const result: DeliverableCheckResult = JSON.parse(raw);

  const certified = result.certified && result.score >= 70;
  const now = new Date();

  if (certified) {
    const autoReleaseAt = new Date(now.getTime() + 12 * 60 * 60 * 1000);

    await Milestone.findByIdAndUpdate(milestoneId, {
      $set: {
        aiCertified:           true,
        aiCertifiedAt:         now,
        status:                "ai_certified",
        aiCertificationReport: result.summary,
        aiCertificationScore:  result.score,
        aiAutoReleaseAt:       autoReleaseAt,
        deliverableUrls,
        deliverableNotes,
      },
    });

    // Notify client (project owner)
    if (project.ownerId) {
      await Notification.create({
        user:        project.ownerId,
        title:       "Deliverables AI Certified",
        message:     `AI has reviewed and certified your consultant's deliverables for milestone "${milestone.title}". Score: ${result.score}/100. Funds will auto-release in 12 hours if no dispute is raised.`,
        type:        "alert",
        severity:    "High",
        relatedId:   String(milestoneId),
        relatedType: "project",
        read:        false,
      });
    }

    // Notify consultant
    const consultantId = project.consultants?.[0];
    if (consultantId) {
      await Notification.create({
        user:        consultantId,
        title:       "Your Deliverables Have Been AI Certified",
        message:     `Your deliverables for milestone "${milestone.title}" have been AI certified with a score of ${result.score}/100. Funds will auto-release in 12 hours unless the client raises a dispute.`,
        type:        "alert",
        severity:    "High",
        relatedId:   String(milestoneId),
        relatedType: "project",
        read:        false,
      });
    }
  } else {
    await Milestone.findByIdAndUpdate(milestoneId, {
      $set: {
        aiCertified:           false,
        status:                "ai_rejected",
        aiCertificationReport: result.summary,
        aiCertificationScore:  result.score,
        deliverableUrls,
        deliverableNotes,
      },
    });

    // Notify consultant of rejection
    const consultantId = project.consultants?.[0];
    if (consultantId) {
      const gaps = result.unmet_requirements?.join("; ") || "See AI report for details";
      await Notification.create({
        user:        consultantId,
        title:       "AI Review: Deliverables Need Revision",
        message:     `AI review found issues with your deliverables for milestone "${milestone.title}" (score: ${result.score}/100). Issues: ${gaps}`,
        type:        "alert",
        severity:    "High",
        relatedId:   String(milestoneId),
        relatedType: "project",
        read:        false,
      });
    }
  }

  return { ...result, certified };
}

// POST /api/ai/deliverable-check
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const limit = await rateLimit(`ai-deliverable-check:${ip}`, { windowMs: 60_000, max: 10 });
    if (!limit.allowed) {
      return NextResponse.json({ success: false, message: "Rate limit exceeded" }, { status: 429 });
    }

    await connectDB();

    const body = await request.json();
    const { milestoneId, projectId, deliverableUrls, deliverableNotes } = body;

    if (!milestoneId || !projectId) {
      return NextResponse.json(
        { success: false, message: "milestoneId and projectId are required" },
        { status: 400 }
      );
    }

    const result = await runDeliverableCheck({
      milestoneId,
      projectId,
      deliverableUrls: deliverableUrls ?? [],
      deliverableNotes: deliverableNotes ?? "",
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("[AI deliverable-check]", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
