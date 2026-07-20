import { NextRequest, NextResponse } from "next/server";
import * as milestoneController from "@/controllers/milestoneController";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";
import { Project } from "@/lib/models/Project";
import connectDB from "@/lib/db";

type Params = Promise<{ id: string; milestoneId: string }>;

export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;
        const engineBlock = denyEngineUsers(auth);
        if (engineBlock) return engineBlock;

        await connectDB();
        const { id: projectId, milestoneId } = await params;

        // Verify caller is the project owner or an assigned consultant
        const project = await Project.findById(projectId).lean() as any;
        if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

        const isOwner = project.ownerId?.toString() === auth.userId;
        const isConsultant = Array.isArray(project.consultants) &&
            project.consultants.some((c: any) => c.toString() === auth.userId);
        const isAdmin = auth.userRole === "admin";

        if (!isOwner && !isConsultant && !isAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const milestone = await milestoneController.getMilestone(milestoneId);
        if (!milestone) return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
        return NextResponse.json(milestone);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
