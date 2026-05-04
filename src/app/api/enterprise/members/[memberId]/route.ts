import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { OrgMember, DEFAULT_PERMISSIONS } from "@/lib/models/OrgMember";

type Params = Promise<{ memberId: string }>;

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (!auth.orgId) return NextResponse.json({ error: "No enterprise org" }, { status: 403 });
    if (!["org_admin", "org_manager"].includes(auth.orgRole ?? ""))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { memberId } = await params;
    const { role, status } = await req.json();

    const update: Record<string, unknown> = {};
    if (role)   { update.role = role; update.permissions = DEFAULT_PERMISSIONS[role] ?? {}; }
    if (status) { update.status = status; }

    const member = await OrgMember.findOneAndUpdate(
      { _id: memberId, orgId: auth.orgId },
      { $set: update },
      { new: true }
    ).lean();

    if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: member });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (!auth.orgId) return NextResponse.json({ error: "No enterprise org" }, { status: 403 });
    if (auth.orgRole !== "org_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { memberId } = await params;
    await OrgMember.findOneAndDelete({ _id: memberId, orgId: auth.orgId });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
