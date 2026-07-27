import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Milestone } from "@/lib/models/Milestone";
import { Escrow } from "@/lib/models/Escrow";
import { Project } from "@/lib/models/Project";
import { Notification } from "@/lib/models/Notification";
import { verifyAuth } from "@/lib/middleware/auth";
import { rateLimit } from "@/lib/rateLimit";

// GET /api/escrow/auto-release
// Called by a cron job (x-cron-secret header) or by a signed-in user on
// workspace load. Previously open to anyone — it only releases milestones that
// are already ai_certified and past their deadline, but leaving an unauthenticated
// endpoint that moves money and does unbounded DB writes is not acceptable.
export async function GET(request: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const isCron =
      !!cronSecret && request.headers.get("x-cron-secret") === cronSecret;

    let callerId: string | null = null;

    if (!isCron) {
      const auth = await verifyAuth(request);
      if (!auth?.userId) {
        return NextResponse.json({ message: "Unauthorised." }, { status: 401 });
      }
      callerId = auth.userId;
      // Throttle user-triggered sweeps; cron is exempt.
      const limit = await rateLimit(`escrow-autorelease:${auth.userId}`, {
        windowMs: 60_000,
        max: 5,
      });
      if (!limit.allowed) {
        return NextResponse.json({ message: "Too many requests." }, { status: 429 });
      }
    }

    await connectDB();

    const now = new Date();

    // Find all milestones eligible for auto-release:
    // - aiAutoReleaseAt has passed
    // - still in ai_certified status (not yet released)
    // - AI certified flag is true
    /* Cron sweeps the platform. A signed-in caller sweeps only their own
       escrows — triggering a release across everyone else's milestones is not
       theirs to do, even when each one is already certified and overdue. */
    /* Release on silence only. The milestone must still be sitting in
       ai_certified. Disputing sets status to "dispute", approving sets
       "approved", and a stop or rejection moves it too — so any client action at
       all takes the milestone out of this filter, which is exactly the
       intention. The deadline is the long silence window from
       lib/escrow/autoReleasePolicy, not an overnight timer. */
    const milestoneFilter: Record<string, unknown> = {
      aiAutoReleaseAt: { $lte: now },
      status:          "ai_certified",
      aiCertified:     true,
    };

    if (callerId) {
      const own = await Escrow.find(
        {
          status: "funded",
          $or: [{ clientId: callerId }, { consultantId: callerId }, { userId: callerId }],
        },
        { milestoneId: 1 },
      ).lean() as any[];

      if (own.length === 0) {
        return NextResponse.json({ success: true, released: 0, milestones: [] });
      }
      milestoneFilter._id = { $in: own.map((e) => e.milestoneId) };
    }

    const eligibleMilestones = await Milestone.find(milestoneFilter).lean() as any[];

    if (eligibleMilestones.length === 0) {
      return NextResponse.json({ success: true, released: 0, milestones: [] });
    }

    const releasedIds: string[] = [];
    const errors: Array<{ milestoneId: string; error: string }> = [];

    for (const milestone of eligibleMilestones) {
      try {
        const milestoneId = String(milestone._id);

        // Find funded escrow for this milestone
        const escrow = await Escrow.findOne({
          milestoneId: milestone._id,
          status:      "funded",
        }) as any;

        if (!escrow) {
          // Escrow may already be released or not exist — skip gracefully
          errors.push({ milestoneId, error: "No funded escrow found" });
          continue;
        }

        // Atomic transition: funded → releasing to prevent double-release
        const claimed = await Escrow.findOneAndUpdate(
          { _id: escrow._id, status: "funded" },
          { $set: { status: "releasing" } },
          { new: false }
        );
        if (!claimed) {
          errors.push({ milestoneId, error: "Escrow already releasing or released" });
          continue;
        }

        // Finalize escrow release
        await Escrow.findByIdAndUpdate(escrow._id, {
          $set: {
            status:     "released",
            releasedAt: now,
          },
        });

        // Update milestone
        await Milestone.findByIdAndUpdate(milestoneId, {
          $set: {
            status:          "released",
            completedAt:     now,
            fundsReleasedAt: now,
            releaseMethod:   "auto_release",
          },
        });

        // Fetch project for participant IDs
        const project = await Project.findById(milestone.projectId).lean() as any;
        const consultantId = escrow.consultantId ?? project?.consultants?.[0];

        // Notify client
        if (project?.ownerId) {
          await Notification.create({
            user:        project.ownerId,
            title:       "Funds Auto-Released",
            message:     `Funds for milestone "${milestone.title}" have been automatically released to the consultant after the 12-hour review window with no dispute raised.`,
            type:        "alert",
            severity:    "High",
            relatedId:   milestoneId,
            relatedType: "project",
            read:        false,
          });
        }

        // Notify consultant
        if (consultantId) {
          await Notification.create({
            user:        consultantId,
            title:       "Payment Automatically Released",
            message:     `Your payment for milestone "${milestone.title}" has been automatically released. The 12-hour review window passed with no dispute.`,
            type:        "alert",
            severity:    "High",
            relatedId:   milestoneId,
            relatedType: "project",
            read:        false,
          });
        }

        releasedIds.push(milestoneId);
      } catch (err: any) {
        console.error(`[auto-release] Error releasing milestone ${milestone._id}:`, err.message);
        errors.push({ milestoneId: String(milestone._id), error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      released: releasedIds.length,
      milestones: releasedIds,
      ...(errors.length > 0 ? { errors } : {}),
    });
  } catch (error: any) {
    console.error("[auto-release]", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
