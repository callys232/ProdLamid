import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Notification } from "@/lib/models/Notification";

// GET /api/consultant/alerts — consultant/seller-specific alerts
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    if (auth.userRole !== "seller" && auth.userRole !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? 10);

    const alerts = await Notification.find({
      user: auth.userId,
      type: { $in: ["alert", "system", "activity", "message"] },
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const unreadCount = await Notification.countDocuments({
      user: auth.userId,
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
