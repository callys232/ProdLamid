import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Organization } from "@/lib/models/Organization";
import { OrgMember } from "@/lib/models/OrgMember";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (!auth.orgId) return NextResponse.json({ error: "No enterprise org" }, { status: 403 });

    const [org, memberCount, pendingInvites] = await Promise.all([
      Organization.findById(auth.orgId).lean() as any,
      OrgMember.countDocuments({ orgId: auth.orgId, status: "active" }),
      OrgMember.countDocuments({ orgId: auth.orgId, status: "pending" }),
    ]);

    // When DB is live, aggregate from Project model:
    // const activeProjects = await Project.countDocuments({ orgId: auth.orgId, status: { $in: ["open","ongoing"] } });
    // For now return 0 — dashboard uses mock overlay
    const stats = {
      activeProjects:    0,
      totalSpend:        0,
      activeConsultants: 0,
      memberCount,
      maxMembers:        org?.maxMembers ?? 50,
      pendingInvites,
      tier:              org?.tier ?? "enterprise",
      orgName:           org?.name ?? "",
      orgStatus:         org?.status ?? "trial",
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
