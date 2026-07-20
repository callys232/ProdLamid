import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";
import { Team } from "@/lib/models/Team";

export const dynamic = "force-dynamic";
type Params = Promise<{ id: string }>;

// GET /api/teams/[id]
export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    const engineBlock = denyEngineUsers(auth);
    if (engineBlock) return engineBlock;
    const { id } = await params;

    const team = await Team.findById(id)
      .populate({ path: "members.user", select: "username email role", strictPopulate: false });
    if (!team) return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: team });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

// PATCH /api/teams/[id] — update name/description
export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    const engineBlock = denyEngineUsers(auth);
    if (engineBlock) return engineBlock;
    const { id } = await params;
    const { name, description } = await req.json();

    const team = await Team.findOneAndUpdate(
      { _id: id, ownerId: auth.userId },
      { $set: { ...(name && { name }), ...(description !== undefined && { description }) } },
      { new: true }
    );
    if (!team) return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: team });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

// PUT /api/teams/[id] — full update (backward compat)
export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    const engineBlock = denyEngineUsers(auth);
    if (engineBlock) return engineBlock;
    const { id } = await params;
    const body = await req.json();

    const team = await Team.findByIdAndUpdate(id, body, { new: true, runValidators: true })
      .populate({ path: "members.user", select: "username email role", strictPopulate: false });
    if (!team) return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: team });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

// DELETE /api/teams/[id]
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    const engineBlock = denyEngineUsers(auth);
    if (engineBlock) return engineBlock;
    const { id } = await params;

    const team = await Team.findOneAndDelete({ _id: id, ownerId: auth.userId });
    if (!team) return NextResponse.json({ success: false, message: "Team not found or unauthorised" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Team deleted" });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
