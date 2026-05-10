import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Team } from "@/lib/models/Team";
import { Users } from "@/lib/models/User";

export const dynamic = "force-dynamic";
type Params = Promise<{ id: string }>;

// POST /api/teams/[id]/members — add member by email
export async function POST(req: NextRequest, { params }: { params: Params }) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    const { email, role } = await req.json();

    if (!email) return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });

    const team = await Team.findById(id);
    if (!team) return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });

    const user = await Users.findOne({ email }).select("_id username email role");
    if (!user) return NextResponse.json({ success: false, message: "No user found with that email" }, { status: 404 });

    const already = team.members.some((m: any) => String(m.user) === String(user._id));
    if (already) return NextResponse.json({ success: false, message: "User is already in this team" }, { status: 409 });

    team.members.push({ user: user._id, role: role ?? "member", addedAt: new Date() });
    await team.save();

    const updated = await Team.findById(id)
      .populate({ path: "members.user", select: "username email role", strictPopulate: false })
      .lean();

    return NextResponse.json({ success: true, data: updated }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

// DELETE /api/teams/[id]/members — remove member by userId
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    const { userId } = await req.json();

    if (!userId) return NextResponse.json({ success: false, message: "userId is required" }, { status: 400 });

    const team = await Team.findByIdAndUpdate(
      id,
      { $pull: { members: { user: userId } } },
      { new: true }
    ).populate({ path: "members.user", select: "username email role", strictPopulate: false });

    if (!team) return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: team });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
