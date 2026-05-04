import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models/Project";
import { Users } from "@/lib/models/User";
import { Profile } from "@/lib/models/Profile";

export const dynamic = "force-dynamic";

// GET /api/search?q=&type=projects|consultants|all&category=&skill=&minRate=&maxRate=&location=&page=&limit=
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const q        = searchParams.get("q")        ?? "";
    const type     = searchParams.get("type")     ?? "all";
    const category = searchParams.get("category") ?? "";
    const skill    = searchParams.get("skill")    ?? "";
    const location = searchParams.get("location") ?? "";
    const minRate  = Number(searchParams.get("minRate")  ?? 0);
    const maxRate  = Number(searchParams.get("maxRate")  ?? 999999);
    const page     = Math.max(1, Number(searchParams.get("page")  ?? 1));
    const limit    = Math.min(50, Number(searchParams.get("limit") ?? 20));
    const skip     = (page - 1) * limit;

    const results: { projects?: any[]; consultants?: any[]; totals: Record<string, number> } = { totals: {} };

    // ── Projects ─────────────────────────────────────────────────────
    if (type === "all" || type === "projects") {
      const projectQuery: any = { status: "open" };
      if (q)        projectQuery.$or = [
        { title:       { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
      if (category) projectQuery.category = category;
      if (skill)    projectQuery.skills   = { $in: [new RegExp(skill, "i")] };
      if (location) projectQuery.location = { $regex: location, $options: "i" };
      if (minRate)  projectQuery.budget   = { $gte: minRate };
      if (maxRate && maxRate < 999999) {
        projectQuery.budget = { ...(projectQuery.budget ?? {}), $lte: maxRate };
      }

      const [projects, total] = await Promise.all([
        Project.find(projectQuery).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Project.countDocuments(projectQuery),
      ]);

      results.projects         = projects;
      results.totals.projects  = total;
    }

    // ── Consultants ───────────────────────────────────────────────────
    if (type === "all" || type === "consultants") {
      const profileQuery: any = {};
      if (q)       profileQuery.$or = [
        { title: { $regex: q, $options: "i" } },
        { bio:   { $regex: q, $options: "i" } },
      ];
      if (skill)   profileQuery.skills   = { $in: [new RegExp(skill, "i")] };
      if (category) profileQuery.industry = { $regex: category, $options: "i" };
      if (minRate) profileQuery.rate = { $gte: minRate };
      if (maxRate && maxRate < 999999) {
        profileQuery.rate = { ...(profileQuery.rate ?? {}), $lte: maxRate };
      }

      const [profiles, total] = await Promise.all([
        Profile.find(profileQuery)
          .populate({ path: "user", select: "username isPremium", strictPopulate: false })
          .sort({ rating: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Profile.countDocuments(profileQuery),
      ]);

      results.consultants        = profiles;
      results.totals.consultants = total;
    }

    return NextResponse.json({
      success: true,
      data:    results,
      pagination: { page, limit, pages: Math.ceil((results.totals.projects ?? results.totals.consultants ?? 0) / limit) },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
