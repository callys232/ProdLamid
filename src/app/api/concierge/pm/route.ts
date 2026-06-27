import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Users } from "@/lib/models/User";
import { Profile } from "@/lib/models/Profile";

export const dynamic = "force-dynamic";

// GET /api/concierge/pm — return the assigned PM for this concierge user
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const user = await Users.findById(auth.userId).lean() as any;
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    // If user has a specific assigned PM user ID on their record, fetch it
    const pmUserId = user.assignedPmId;
    if (pmUserId) {
      const pmUser    = await Users.findById(pmUserId).select("username email").lean() as any;
      const pmProfile = await Profile.findOne({ user: pmUserId }).lean() as any;
      if (pmUser) {
        return NextResponse.json({
          success: true,
          data: {
            id:              String(pmUser._id),
            name:            pmProfile?.firstName ? `${pmProfile.firstName} ${pmProfile.lastName ?? ""}`.trim() : pmUser.username,
            title:           pmProfile?.title ?? "Dedicated Project Manager",
            email:           pmUser.email,
            phone:           pmProfile?.phone ?? null,
            availability:    "Mon–Fri, 8am–6pm WAT",
            specialties:     pmProfile?.skills ?? [],
            rating:          pmProfile?.rating ?? 4.9,
            projectsManaged: 47,
            yearsExperience: 12,
            currentProjects: [],
            nextCheckIn:     null,
            schedule: [
              { day: "Mon", slots: ["10:00", "14:00"] },
              { day: "Tue", slots: ["09:00", "11:00", "15:00"] },
              { day: "Wed", slots: ["10:00"] },
              { day: "Thu", slots: ["09:00", "13:00", "16:00"] },
              { day: "Fri", slots: ["10:00", "14:00"] },
            ],
          },
        });
      }
    }

    // No PM assigned yet — return 404 so the frontend falls back to mock
    return NextResponse.json({ success: false, message: "No PM assigned" }, { status: 404 });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

// POST /api/concierge/pm/schedule — book a call with PM
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { slot, note } = await req.json();

    // TODO: integrate with calendar API (Calendly / Google Calendar)
    // For now, log the booking request and notify via Notification
    const { Notification } = await import("@/lib/models/Notification");
    await Notification.create({
      user:    auth.userId,
      title:   "Call booking request submitted",
      message: `You requested a call${slot ? ` on ${slot.day} at ${slot.time}` : ""}. Your PM will confirm shortly.${note ? ` Note: ${note}` : ""}`,
      type:    "system",
      severity: "Low",
    });

    return NextResponse.json({ success: true, message: "Booking request received" }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
