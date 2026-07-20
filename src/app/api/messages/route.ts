import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";
import { Message } from "@/lib/models/Message";
import { Notification } from "@/lib/models/Notification";
import { Users } from "@/lib/models/User";
import { Project } from "@/lib/models/Project";
import { Profile } from "@/lib/models/Profile";
import { notifyProject } from "./stream/route";

// GET /api/messages?projectId=xxx — fetch messages for a project
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    const engineBlock = denyEngineUsers(auth);
    if (engineBlock) return engineBlock;

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId") ?? searchParams.get("escrowId");
    const limit = Number(searchParams.get("limit") ?? 50);

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "projectId is required" },
        { status: 400 }
      );
    }

    const rawMessages = await Message.find({ projectId })
      .sort({ sentAt: 1 })
      .limit(limit)
      .populate({ path: "senderId", select: "username email role", strictPopulate: false })
      .lean() as any[];

    // Attach profile pictures
    const senderIds = [...new Set(rawMessages.map((m: any) => m.senderId?._id?.toString()).filter(Boolean))];
    const profiles  = senderIds.length
      ? await Profile.find({ user: { $in: senderIds } }).select("user profilePicture").lean() as any[]
      : [];
    const picMap = Object.fromEntries(profiles.map(p => [p.user.toString(), p.profilePicture]));

    const messages = rawMessages.map((m: any) => ({
      ...m,
      senderId: m.senderId ? { ...m.senderId, profileImage: picMap[m.senderId._id?.toString()] ?? null } : m.senderId,
    }));

    // Mark messages as read by this user
    await Message.updateMany(
      { projectId, readBy: { $ne: auth.userId } },
      { $addToSet: { readBy: auth.userId } }
    );

    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/messages — send a message in a project workspace
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    const engineBlock = denyEngineUsers(auth);
    if (engineBlock) return engineBlock;

    const body = await request.json();
    // Support both projectId and escrowId (escrowId = project._id in this app)
    const projectId = body.projectId ?? body.escrowId;
    const { message, recipient, type = "text", milestoneId, fileUrl } = body;

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "projectId is required" },
        { status: 400 }
      );
    }

    if (!message && !fileUrl) {
      return NextResponse.json(
        { success: false, message: "message or fileUrl is required" },
        { status: 400 }
      );
    }

    // Save the message
    const saved = await Message.create({
      projectId,
      senderId: auth.userId,
      type,
      message,
      milestoneId: milestoneId ?? undefined,
      fileUrl: fileUrl ?? undefined,
      readBy: [auth.userId],
    });

    // Find the project to get the other party's userId for notification
    if (recipient) {
      try {
        const project = await Project.findById(projectId).lean() as any;
        const sender = await Users.findById(auth.userId).select("username email role").lean() as any;

        // Determine target user from project
        let targetUserId: string | null = null;
        if (recipient === "client" && project?.ownerId) {
          targetUserId = String(project.ownerId);
        } else if (recipient === "consultant" && project?.consultants?.[0]) {
          targetUserId = String(project.consultants[0]);
        }

        if (targetUserId && targetUserId !== String(auth.userId)) {
          await Notification.create({
            user: targetUserId,
            userId: auth.userId,
            title: "New message",
            message: `${sender?.username ?? "Someone"} sent you a message${project?.title ? ` on "${project.title}"` : ""}.`,
            type: "message",
            severity: "Low",
            relatedId: String(projectId),
            relatedType: "project",
          });
        }
      } catch {
        // Notification failure is non-critical — don't block the message save
      }
    }

    // Broadcast to SSE subscribers of this project
    notifyProject(String(projectId), { type: "new_message", data: saved });

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
