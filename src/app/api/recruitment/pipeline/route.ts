import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Candidate } from "@/lib/models/Candidate";
import { Users } from "@/lib/models/User";

export const dynamic = "force-dynamic";

const ENTERPRISE_TYPES = ["Enterprise", "Concierge", "Admin"];
const PIPELINE_STAGES  = ["applied", "screening", "interview", "offer", "hired"] as const;

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const userData = await Users.findById(auth.userId).select("accountType").lean() as { accountType?: string } | null;
    if (!userData || !ENTERPRISE_TYPES.includes(userData.accountType ?? "")) {
      return NextResponse.json({ success: false, message: "Enterprise access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    const matchQuery: Record<string, unknown> = { status: "active" };
    if (jobId) matchQuery.jobOpeningId = jobId;

    const candidates = await Candidate.find(matchQuery)
      .populate({ path: "jobOpeningId", select: "title department", strictPopulate: false })
      .populate({ path: "assignedTo",   select: "username email",    strictPopulate: false })
      .sort({ createdAt: -1 })
      .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const flat = candidates as any[];

    const grouped = PIPELINE_STAGES.reduce((acc, stage) => {
      acc[stage] = flat.filter((c) => c.pipelineStage === stage);
      return acc;
    }, {} as Record<string, typeof flat>);

    const counts = PIPELINE_STAGES.reduce((acc, stage) => {
      acc[stage] = grouped[stage].length;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      data: { pipeline: grouped, counts, total: candidates.length },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
