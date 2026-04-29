import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Users } from "@/lib/models/User";
import { Project } from "@/lib/models/Project";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (auth.userRole !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [totalUsers, totalProjects, openProjects, recentUser] = await Promise.all([
      Users.countDocuments({ accountDeleted: { $ne: true } }),
      Project.countDocuments(),
      Project.countDocuments({ status: "open" }),
      Project.findOne().sort({ createdAt: -1 }).select("_id").lean(),
    ]);

    return NextResponse.json({
      success: true,
      projectId: (recentUser as any)?._id?.toString() ?? null,
      clientId:  null,
      stats: { totalUsers, totalProjects, openProjects },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
