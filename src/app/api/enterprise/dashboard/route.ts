import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Organization } from "@/lib/models/Organization";
import { OrgMember } from "@/lib/models/OrgMember";
import { Project } from "@/lib/models/Project";
import { Escrow } from "@/lib/models/Escrow";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (!auth.orgId) return NextResponse.json({ error: "No enterprise org" }, { status: 403 });

    // Fetch all active org member user IDs for project scoping
    const orgMembers = await OrgMember.find({ orgId: auth.orgId, status: "active" }).select("userId").lean();
    const memberUserIds = orgMembers.map((m: any) => m.userId).filter(Boolean);

    const [org, memberCount, pendingInvites, activeProjects, releasedEscrows] = await Promise.all([
      Organization.findById(auth.orgId).lean() as any,
      OrgMember.countDocuments({ orgId: auth.orgId, status: "active" }),
      OrgMember.countDocuments({ orgId: auth.orgId, status: "pending" }),
      Project.countDocuments({ ownerId: { $in: memberUserIds }, status: { $in: ["open", "ongoing"] } }),
      Escrow.aggregate([
        { $match: { status: "released" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    // Count unique consultants hired across org projects
    const orgProjects = await Project.find({ ownerId: { $in: memberUserIds } })
      .select("consultants").lean() as any[];
    const consultantIds = new Set(orgProjects.flatMap((p: any) => (p.consultants ?? []).map(String)));

    const totalSpend = releasedEscrows[0]?.total ?? 0;

    const stats = {
      activeProjects,
      totalSpend,
      activeConsultants: consultantIds.size,
      memberCount,
      maxMembers:        org?.maxMembers ?? 50,
      pendingInvites,
      tier:              org?.tier    ?? "enterprise",
      orgName:           org?.name    ?? "",
      orgStatus:         org?.status  ?? "trial",
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
