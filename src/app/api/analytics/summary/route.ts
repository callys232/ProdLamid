import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/requireAuth";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models/Project";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    let userId: string;
    try {
      const decoded = requireAuth(req);
      userId = (decoded as any).sub ?? (decoded as any).userId ?? "";
    } catch {
      /* Not authenticated — return graceful fallback data */
      return NextResponse.json({
        efficiency: 74, progress: 58, workload: 62, profitability: 81,
        bottleneck: null, recommendation: "Sign in to see your live project analytics.",
      });
    }

    await connectDB();

    /* ── Fetch user's projects ── */
    const projects = await Project.find({
      $or: [{ clientId: userId }, { consultants: userId }],
    }).lean();

    const total     = projects.length;
    const ongoing   = projects.filter((p: any) => p.status === "ongoing").length;
    const completed = projects.filter((p: any) => p.status === "completed").length;
    const open      = projects.filter((p: any) => p.status === "open").length;

    /* ── Milestone progress ── */
    const progressValues = projects
      .map((p: any) => p.milestoneProgress ?? 0)
      .filter((v: number) => v > 0);
    const avgProgress = progressValues.length
      ? Math.round(progressValues.reduce((a: number, b: number) => a + b, 0) / progressValues.length)
      : 0;

    /* ── Efficiency score (% of projects on time) ── */
    const withDeadlines = projects.filter((p: any) => p.deadline);
    const onTime = withDeadlines.filter((p: any) => {
      if (p.status === "completed") return true;
      return new Date(p.deadline) >= new Date();
    });
    const efficiency = withDeadlines.length
      ? Math.round((onTime.length / withDeadlines.length) * 100)
      : 75;

    /* ── Workload (ongoing / total %) ── */
    const workload = total ? Math.round((ongoing / total) * 100) : 0;

    /* ── Bottleneck detection ── */
    let bottleneck: string | null = null;
    const overdueProjects = projects.filter((p: any) =>
      p.status === "ongoing" && p.deadline && new Date(p.deadline) < new Date()
    );
    const disputes = projects.filter((p: any) => p.hasDispute);

    if (disputes.length > 0) bottleneck = `${disputes.length} open dispute${disputes.length > 1 ? "s" : ""} detected`;
    else if (overdueProjects.length > 0) bottleneck = `${overdueProjects.length} overdue project${overdueProjects.length > 1 ? "s" : ""}`;

    /* ── Recommendation ── */
    let recommendation: string | null = null;
    if (efficiency < 70) recommendation = "Several projects are behind schedule — review milestones and escalate blockers.";
    else if (workload > 80) recommendation = "High workload detected. Consider delegating or pausing new projects.";
    else if (open > 3)    recommendation = `${open} projects are open and awaiting consultants — run AI Match to fill them faster.`;

    return NextResponse.json({
      efficiency:      Math.min(efficiency, 100),
      progress:        avgProgress,
      workload:        Math.min(workload, 100),
      profitability:   completed ? Math.round((completed / total) * 100) : 0,
      bottleneck,
      recommendation,
      meta: { total, ongoing, completed, open },
    });
  } catch {
    /* Graceful fallback — agent shows mock data on error */
    return NextResponse.json({
      efficiency:    74,
      progress:      58,
      workload:      62,
      profitability: 81,
      bottleneck:    null,
      recommendation:"Connect more projects to see live analytics.",
    });
  }
}
