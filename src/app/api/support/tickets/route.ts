import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { SupportTicket } from "@/lib/models/SupportTicket";
import { Notification } from "@/lib/models/Notification";

export const dynamic = "force-dynamic";

// GET /api/support/tickets — list tickets for the current user
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const filter: Record<string, any> = { userId: auth.userId };
    if (status) filter.status = status;

    const tickets = await SupportTicket.find(filter)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    // Shape for frontend
    const data = (tickets as any[]).map(t => ({
      id:       `LCS-${String(t._id).slice(-4).toUpperCase()}`,
      subject:  t.subject,
      status:   t.status,
      priority: t.priority,
      date:     new Date(t.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      message:  t.message,
    }));

    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

// POST /api/support/tickets — create a new ticket
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { subject, message, priority = "medium", category = "general" } = await req.json();
    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json({ success: false, message: "Subject and message are required" }, { status: 400 });
    }

    const ticket = await SupportTicket.create({
      userId:   auth.userId,
      subject:  subject.trim(),
      message:  message.trim(),
      priority,
      category,
      status:   "open",
    });

    // Notify the user
    await Notification.create({
      user:    auth.userId,
      title:   "Support ticket submitted",
      message: `Your ticket "${subject}" has been received. We'll respond within 2 hours for critical issues.`,
      type:    "system",
      severity: priority === "critical" ? "High" : priority === "high" ? "Medium" : "Low",
      relatedId:   String(ticket._id),
      relatedType: "other",
    });

    return NextResponse.json({
      success: true,
      data: {
        id:       `LCS-${String(ticket._id).slice(-4).toUpperCase()}`,
        subject:  ticket.subject,
        status:   ticket.status,
        priority: ticket.priority,
        date:     new Date(ticket.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      },
    }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
