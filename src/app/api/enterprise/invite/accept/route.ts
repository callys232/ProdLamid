import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { OrgMember } from "@/lib/models/OrgMember";
import { Users } from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

    const member = await OrgMember.findOne({ inviteToken: token, status: "pending" });
    if (!member) return NextResponse.json({ error: "Invalid or expired invite" }, { status: 404 });

    member.userId      = auth.userId as any;
    member.status      = "active";
    member.joinedAt    = new Date();
    member.inviteToken = undefined;
    await member.save();

    await Users.findByIdAndUpdate(auth.userId, {
      orgId:   member.orgId,
      orgRole: member.role,
    });

    return NextResponse.json({ success: true, data: member });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
