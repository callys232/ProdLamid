import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Organization } from "@/lib/models/Organization";
import { OrgMember, DEFAULT_PERMISSIONS } from "@/lib/models/OrgMember";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (!auth.orgId) return NextResponse.json({ error: "No enterprise org" }, { status: 403 });

    const members = await OrgMember.find({ orgId: auth.orgId })
      .populate({ path: "userId", select: "username email role", strictPopulate: false })
      .lean();

    return NextResponse.json({ success: true, data: members });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (!auth.orgId) return NextResponse.json({ error: "No enterprise org" }, { status: 403 });
    if (!["org_admin", "org_manager"].includes(auth.orgRole ?? ""))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const org = await Organization.findById(auth.orgId).lean() as any;
    if (!org) return NextResponse.json({ error: "Org not found" }, { status: 404 });

    const activeCount = await OrgMember.countDocuments({ orgId: auth.orgId, status: { $ne: "suspended" } });
    if (activeCount >= org.maxMembers)
      return NextResponse.json({ error: `Member limit of ${org.maxMembers} reached` }, { status: 400 });

    const { email, role = "org_member" } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const existing = await OrgMember.findOne({ orgId: auth.orgId, inviteEmail: email.toLowerCase() });
    if (existing) return NextResponse.json({ error: "Already invited" }, { status: 400 });

    const member = await OrgMember.create({
      orgId: auth.orgId,
      role,
      invitedBy: auth.userId,
      inviteEmail: email.toLowerCase(),
      inviteToken: uuidv4(),
      status: "pending",
      permissions: DEFAULT_PERMISSIONS[role] ?? DEFAULT_PERMISSIONS["org_member"],
    });

    return NextResponse.json({ success: true, data: member }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
