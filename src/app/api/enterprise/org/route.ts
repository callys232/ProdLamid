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
    if (!auth.orgId) return NextResponse.json({ error: "No enterprise org found" }, { status: 404 });

    const org = await Organization.findById(auth.orgId).lean();
    if (!org) return NextResponse.json({ error: "Org not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: org });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (!auth.orgId) return NextResponse.json({ error: "No enterprise org" }, { status: 403 });
    if (auth.orgRole !== "org_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const allowed = ["name", "logoUrl", "industry", "website", "billingCycle", "settings", "orgSize", "description", "employmentHistory"];
    const update: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) update[key] = body[key];
    }

    const org = await Organization.findByIdAndUpdate(auth.orgId, { $set: update }, { new: true }).lean();
    return NextResponse.json({ success: true, data: org });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
