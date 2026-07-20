import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { deductPoints, POINT_COSTS } from "@/lib/services/pointsService";
import { Users } from "@/lib/models/User";

export const dynamic = "force-dynamic";

function skillOverlapScore(mentorSkills: string[], goalSkills: string[]): number {
  if (!goalSkills.length || !mentorSkills.length) return 0;
  const mentorSet = new Set(mentorSkills.map(s => s.toLowerCase()));
  const matches   = goalSkills.filter(s => mentorSet.has(s.toLowerCase())).length;
  return Math.round((matches / goalSkills.length) * 100);
}

function buildMatchReasons(mentor: any, goalSkills: string[], industry: string): string[] {
  const reasons: string[] = [];
  const profile = mentor.profile ?? {};
  const mSkills = (profile.skills ?? []) as string[];

  const overlapping = goalSkills.filter(g =>
    mSkills.some(s => s.toLowerCase().includes(g.toLowerCase()) || g.toLowerCase().includes(s.toLowerCase()))
  );
  if (overlapping.length) {
    reasons.push(`Expert in ${overlapping.slice(0, 2).join(" and ")} — aligns directly with your growth goals`);
  }

  const exp = Number(profile.experience ?? 0);
  if (exp >= 10) reasons.push(`${exp}+ years of deep industry experience to draw from`);
  else if (exp >= 5) reasons.push(`${exp} years of hands-on experience in your target domain`);

  const rating = Number(profile.rating ?? 0);
  if (rating >= 4.5) reasons.push(`Highly rated consultant (${rating.toFixed(1)}/5) with a track record of successful engagements`);

  if (!reasons.length) reasons.push("Broad expertise that complements your development pathway");

  return reasons.slice(0, 3);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectDB();

    const pointsResult = await deductPoints(auth.userId, POINT_COSTS.AI_MENTORSHIP_MATCH, "Mentorship Matching");
    if (!pointsResult.success) {
      return NextResponse.json(
        { success: false, message: pointsResult.message, code: "INSUFFICIENT_POINTS", balance: pointsResult.balance },
        { status: 402 }
      );
    }
    const body = await req.json();
    const { goals, currentSkills, skillsToGrow, industryFocus, preferredFormat } = body;

    if (!goals) {
      return NextResponse.json({ message: "goals is required." }, { status: 400 });
    }

    const goalSkillList: string[] = [
      ...(Array.isArray(currentSkills) ? currentSkills : []),
      ...(Array.isArray(skillsToGrow)  ? skillsToGrow  : []),
    ].map(s => String(s).trim()).filter(Boolean);

    // Find verified consultants to serve as mentors
    const consultants = await Users.find({
      role:          "seller",
      isVerified:    true,
      accountDeleted: { $ne: true },
    })
      .populate({ path: "profile", strictPopulate: false })
      .select("email username profile")
      .limit(200)
      .lean();

    const scored = consultants.map((u: any) => {
      const profile   = u.profile ?? {};
      const mSkills   = (profile.skills ?? []) as string[];
      const overlap   = skillOverlapScore(mSkills, goalSkillList);
      const expBonus  = Math.min(Number(profile.experience ?? 0) * 2, 20);
      const ratingBonus = Math.round(Number(profile.rating ?? 0) * 4);
      const score     = Math.min(overlap + expBonus + ratingBonus, 100);

      return {
        mentor: {
          id:       u._id?.toString(),
          name:     [`${profile.firstName ?? ""}`, `${profile.lastName ?? ""}`].join(" ").trim() || u.username || "Expert",
          title:    profile.title ?? "Consultant",
          skills:   mSkills.slice(0, 6),
          industry: profile.industry ?? industryFocus ?? "Consulting",
          bio:      profile.bio ?? "",
          avatar:   profile.profilePicture ?? null,
          rating:   Number(profile.rating ?? 0),
          experience: Number(profile.experience ?? 0),
        },
        score,
        matchReasons: buildMatchReasons(u, goalSkillList, industryFocus ?? ""),
      };
    });

    scored.sort((a, b) => b.score - a.score);

    return NextResponse.json({ success: true, matches: scored.slice(0, 12) });
  } catch (e: any) {
    console.error("Mentorship matching error:", e);
    return NextResponse.json({ success: false, message: "Failed to find mentorship matches." }, { status: 500 });
  }
}
