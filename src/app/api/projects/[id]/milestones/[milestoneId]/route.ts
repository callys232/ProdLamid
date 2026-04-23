import { NextRequest, NextResponse } from "next/server";
import * as milestoneController from "@/controllers/milestoneController";

type Params = Promise<{ id: string; milestoneId: string }>;

export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const { milestoneId } = await params;
        const milestone = await milestoneController.getMilestone(milestoneId);
        if (!milestone) return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
        return NextResponse.json(milestone);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
