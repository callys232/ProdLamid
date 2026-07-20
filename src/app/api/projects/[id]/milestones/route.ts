import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";
import * as milestoneController from "@/controllers/milestoneController";
import { MilestoneSchemaValidator } from "@/lib/validation/validators";
import { Project } from "@/lib/models/Project";

type Params = Promise<{ id: string }>;

export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const { id } = await params;
        
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;
        const engineBlock = denyEngineUsers(auth);
        if (engineBlock) return engineBlock;

        // Check project authorization
        const project = await Project.findById(id).lean();
        if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

        const isOwner = (project as any).ownerId.toString() === auth.userId;
        const isConsultant = (project as any).consultants.some((c: any) => c.toString() === auth.userId);

        if (!isOwner && !isConsultant) {
            return NextResponse.json({ error: "Unauthorized access to project milestones" }, { status: 403 });
        }

        const milestones = await milestoneController.getMilestones(id);
        return NextResponse.json({ success: true, data: milestones });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;
        const engineBlock = denyEngineUsers(auth);
        if (engineBlock) return engineBlock;

        const { id } = await params;
        const body = await request.json();
        
        const validatedData = MilestoneSchemaValidator.parse(body);
        const milestone = await milestoneController.createMilestone(id, validatedData, auth.userId);

        return NextResponse.json(milestone, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
