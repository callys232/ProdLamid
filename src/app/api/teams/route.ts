import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Team } from "@/lib/models/Team";

export const dynamic = "force-dynamic";

// GET /api/teams?ownerId=xxx — list teams for a user
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("ownerId") ?? auth.userId;

    const teams = await Team.find({ ownerId })
      .populate({ path: "members.user", select: "username email role", strictPopulate: false })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: teams });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

// POST /api/teams — create a team
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { name, description, ownerId } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ success: false, message: "Team name is required" }, { status: 400 });
    }

    const team = await Team.create({
      name:        name.trim(),
      description: description?.trim(),
      ownerId:     ownerId ?? auth.userId,
      members:     [],
    });

    return NextResponse.json({ success: true, data: team }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
