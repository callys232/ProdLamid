import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { verifyAuth } from "@/lib/middleware/auth";
import { Users } from "@/lib/models/User";
import { Profile } from "@/lib/models/Profile";
import { LearningRecord } from "@/lib/models/LearningRecord";

export const dynamic = "force-dynamic";

/**
 * What we already know about a signed-in user, for the career path tool.
 *
 * Visitors get an empty payload and type everything themselves — the tool works
 * either way. Completed learning now comes from LearningRecord, which the LMS
 * populates after each completion, so a signed-in user does not retype what the
 * platform already knows. Anything not yet synced they can still add by hand.
 */
export async function GET(req: NextRequest) {
  const auth = await verifyAuth(req);

  // Not signed in is a normal state here, not an error.
  if (!auth?.userId) {
    return NextResponse.json({ signedIn: false, currentRole: "", skills: [], learning: [] });
  }

  // Demo and dev accounts have ids that are not ObjectIds.
  if (auth.userId.startsWith("demo-") || auth.userId.startsWith("dev-")) {
    return NextResponse.json({ signedIn: true, currentRole: "", skills: [], learning: [] });
  }

  try {
    await connectDB();
    const [user, profile, learning] = await Promise.all([
      Users.findById(auth.userId).select("username").lean() as any,
      Profile.findOne({ user: auth.userId }).select("title skills firstName lastName").lean() as any,
      // Completed only — an in-progress course is not evidence of capability.
      LearningRecord.find({ userId: auth.userId, status: "completed" })
        .select("title skills hours certified completedAt")
        .sort({ completedAt: -1 })
        .limit(50)
        .lean() as any,
    ]);

    return NextResponse.json({
      signedIn:    true,
      name:        profile?.firstName
        ? `${profile.firstName} ${profile.lastName ?? ""}`.trim()
        : user?.username ?? "",
      currentRole: profile?.title ?? "",
      /* Level is unknown — the profile records the skill, not the depth — so
         these arrive at 3 and the user adjusts. Inventing a 5 would flatter the
         result and make the gap analysis useless. */
      skills: (profile?.skills ?? [])
        .filter((s: unknown) => typeof s === "string" && s.trim())
        .slice(0, 20)
        .map((name: string) => ({ name, level: 3 })),

      /* Straight from the LMS. The user can edit or add to it — a course taken
         elsewhere still counts, it just has not been reported here. */
      learning: (learning ?? []).map((l: any) => ({
        title:     l.title,
        covers:    l.skills ?? [],
        hours:     l.hours ?? 0,
        certified: Boolean(l.certified),
      })),
      syncedCount: learning?.length ?? 0,
    });
  } catch (e) {
    console.error("[CareerPath/prefill]", e);
    // A prefill failure must not block the tool.
    return NextResponse.json({ signedIn: true, currentRole: "", skills: [], learning: [] });
  }
}
