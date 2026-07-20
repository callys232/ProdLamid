import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";
import { Project } from "@/lib/models/Project";
import { Profile } from "@/lib/models/Profile";
import { scoreProject } from "@/lib/ai/projectMatcher";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    const engineBlock = denyEngineUsers(auth);
    if (engineBlock) return engineBlock;

    // Fetch the consultant's profile for scoring context
    const profile = await Profile.findOne({ user: auth.userId }).lean() as any;

    const consultant = {
      id:              auth.userId,
      name:            profile ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() : "Consultant",
      email:           "",
      skills:          profile?.skills          ?? [],
      experienceYears: profile?.experience      ?? 0,
      rating:          profile?.rating          ?? 0,
      resumeText:      profile?.bio             ?? "",
      portfolioText:   "",
    };

    const { searchParams } = new URL(request.url);
    const page  = Math.max(1, Number(searchParams.get("page")  ?? 1));
    const limit = Math.min(50, Number(searchParams.get("limit") ?? 20));

    const projects = await Project.find({ status: "open" })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const scored = projects.map((p: any) => ({
      project: {
        id:          p._id.toString(),
        title:       p.title,
        description: p.description,
        skills:      p.skills      ?? [],
        budget:      p.budget,
        hourlyRate:  p.hourlyRate,
        type:        p.type,
        location:    p.location,
        category:    p.category,
        createdAt:   p.createdAt,
      },
      score: scoreProject(
        { ...p, id: p._id.toString(), skills: p.skills ?? [] } as any,
        consultant
      ),
    }));

    scored.sort((a, b) => b.score.total - a.score.total);

    const paged = scored.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      success: true,
      data: paged,
      pagination: { page, limit, total: scored.length, pages: Math.ceil(scored.length / limit) },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
