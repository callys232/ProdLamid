import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Users } from "@/lib/models/User";
import { Project } from "@/lib/models/Project";
import { Bid } from "@/lib/models/Bid";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (auth.userRole !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [
      totalUsers, sellers, clients,
      totalProjects, openProjects, ongoingProjects, completedProjects,
      totalBids,
    ] = await Promise.all([
      Users.countDocuments({ accountDeleted: { $ne: true } }),
      Users.countDocuments({ role: "seller",   accountDeleted: { $ne: true } }),
      Users.countDocuments({ role: "client",   accountDeleted: { $ne: true } }),
      Project.countDocuments(),
      Project.countDocuments({ status: "open" }),
      Project.countDocuments({ status: "ongoing" }),
      Project.countDocuments({ status: "completed" }),
      Bid.countDocuments(),
    ]);

    // Registrations per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const registrations = await Users.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users:    { total: totalUsers, sellers, clients },
        projects: { total: totalProjects, open: openProjects, ongoing: ongoingProjects, completed: completedProjects },
        bids:     { total: totalBids },
        registrations,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
