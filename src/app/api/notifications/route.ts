import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Notification } from "@/lib/models/Notification";
import { sendNotificationEmail } from "@/lib/services/emailNotificationService";

// GET /api/notifications — aggregated count + latest items for the navbar bell
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? 20);

    const notifications = await Notification.find({ user: auth.userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const unreadCount = await Notification.countDocuments({
      user: auth.userId,
      $or: [{ read: false }, { isRead: false }],
    });

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/notifications — create a notification
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { title, message, type = "system", severity = "Low", relatedId, relatedType, targetUserId } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, message: "title and message are required" },
        { status: 400 }
      );
    }

    const recipientId = targetUserId ?? auth.userId;

    const notification = await Notification.create({
      user: recipientId,
      userId: auth.userId,
      title,
      message,
      type,
      severity,
      relatedId,
      relatedType,
    });

    // Fire-and-forget email delivery
    sendNotificationEmail({ userId: recipientId, title, message, type }).catch(() => {});

    return NextResponse.json({ success: true, data: notification }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications — mark all as read
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    await Notification.updateMany(
      { user: auth.userId },
      { $set: { read: true, isRead: true } }
    );

    return NextResponse.json({ success: true, message: "All notifications marked as read" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
