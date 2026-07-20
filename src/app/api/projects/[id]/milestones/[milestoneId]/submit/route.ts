import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";
import { Milestone } from "@/lib/models/Milestone";
import { Project } from "@/lib/models/Project";
import { runDeliverableCheck } from "@/app/api/ai/deliverable-check/route";
import { rateLimit } from "@/lib/rateLimit";

type Params = Promise<{ id: string; milestoneId: string }>;

// POST /api/projects/[id]/milestones/[milestoneId]/submit
export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    const engineBlock = denyEngineUsers(auth);
    if (engineBlock) return engineBlock;

    if (auth.userRole !== "seller") {
      return NextResponse.json(
        { success: false, message: "Only consultants (sellers) can submit deliverables" },
        { status: 403 }
      );
    }

    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const limit = await rateLimit(`submit-deliverables:${auth.userId}:${ip}`, {
      windowMs: 60_000,
      max: 5,
    });
    if (!limit.allowed) {
      return NextResponse.json({ success: false, message: "Rate limit exceeded" }, { status: 429 });
    }

    await connectDB();

    const { id: projectId, milestoneId } = await params;
    const body = await request.json();
    const {
      deliverableUrls,
      deliverableNotes,
      acceptanceCriteria,
    }: {
      deliverableUrls: string[];
      deliverableNotes: string;
      acceptanceCriteria?: string;
    } = body;

    if (!Array.isArray(deliverableUrls) || deliverableUrls.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one deliverable URL is required" },
        { status: 400 }
      );
    }

    // Verify project exists
    const project = await Project.findById(projectId).lean() as any;
    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    // Fetch the milestone (could be a standalone doc OR embedded in project)
    const milestone = await Milestone.findById(milestoneId).lean() as any;
    if (!milestone) {
      return NextResponse.json({ success: false, message: "Milestone not found" }, { status: 404 });
    }

    const allowedStatuses = ["started", "funded"];
    if (!allowedStatuses.includes(milestone.status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Milestone must be in 'started' or 'funded' status to submit deliverables (current: ${milestone.status})`,
        },
        { status: 400 }
      );
    }

    // Mark as submitted
    await Milestone.findByIdAndUpdate(milestoneId, {
      $set: {
        status:             "submitted",
        deliverableUrls,
        deliverableNotes,
        ...(acceptanceCriteria ? { acceptanceCriteria } : {}),
      },
    });

    // Run AI certification check
    const aiResult = await runDeliverableCheck({
      milestoneId,
      projectId,
      deliverableUrls,
      deliverableNotes,
    });

    return NextResponse.json({
      success: true,
      message: aiResult.certified
        ? "Deliverables submitted and AI certified. Funds will auto-release in 12 hours."
        : "Deliverables submitted but did not pass AI review. Please address the issues and resubmit.",
      aiResult,
    });
  } catch (error: any) {
    console.error("[submit deliverables]", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
