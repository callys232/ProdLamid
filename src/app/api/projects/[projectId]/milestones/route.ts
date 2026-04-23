import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import * as milestoneController from "@/controllers/milestoneController";
import { MilestoneSchemaValidator } from "@/lib/validation/validators";

type Params = Promise<{ projectId: string }>;

export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const { projectId } = await params;
        const milestones = await milestoneController.getMilestones(projectId);
        return NextResponse.json(milestones);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        const { projectId } = await params;
        const body = await request.json();
        
        const validatedData = MilestoneSchemaValidator.parse(body);
        const milestone = await milestoneController.createMilestone(projectId, validatedData, auth.userId);

        return NextResponse.json(milestone, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
