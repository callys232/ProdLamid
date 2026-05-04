import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Project } from "@/lib/models/Project";
import { Notification } from "@/lib/models/Notification";

type Params = Promise<{ id: string }>;

// POST /api/projects/[id]/complete — client marks project as completed
export async function POST(req: NextRequest, { params }: { params: Params }) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const project = await Project.findById(id).lean() as any;

    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (String(project.ownerId) !== auth.userId)
      return NextResponse.json({ error: "Only the project owner can mark completion" }, { status: 403 });
    if (project.status === "completed")
      return NextResponse.json({ success: true, message: "Already completed" });

    await Project.findByIdAndUpdate(id, { $set: { status: "completed" } });

    // Notify each consultant to leave a review
    for (const consultantId of (project.consultants ?? [])) {
      await Notification.create({
        user:        consultantId,
        userId:      auth.userId,
        title:       "Project completed — leave a review",
        message:     `"${project.title}" has been marked complete. Share your experience with the client.`,
        type:        "activity",
        severity:    "Low",
        relatedId:   id,
        relatedType: "project",
      });
    }

    // Notify client to leave a review for each consultant
    await Notification.create({
      user:        auth.userId,
      userId:      auth.userId,
      title:       "Project completed — rate your consultants",
      message:     `"${project.title}" is complete. Take a moment to review the consultants you worked with.`,
      type:        "activity",
      severity:    "Low",
      relatedId:   id,
      relatedType: "project",
    });

    return NextResponse.json({ success: true, message: "Project marked as completed" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
