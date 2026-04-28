import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Notification } from "@/lib/models/Notification";

// GET /api/user/alerts — alerts for the authenticated user (any role)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unread") === "true";
    const limit = Number(searchParams.get("limit") ?? 10);

    const query: any = {
      user: auth.userId,
      type: { $in: ["alert", "system", "activity"] },
    };
    if (unreadOnly) query.$or = [{ read: false }, { isRead: false }];

    const alerts = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const unreadCount = await Notification.countDocuments({
      user: auth.userId,
      type: { $in: ["alert", "system", "activity"] },
      $or: [{ read: false }, { isRead: false }],
    });

    return NextResponse.json({ success: true, data: alerts, unreadCount });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
