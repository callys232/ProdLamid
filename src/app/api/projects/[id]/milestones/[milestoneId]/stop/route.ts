import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";
import * as milestoneController from "@/controllers/milestoneController";

type Params = Promise<{ id: string; milestoneId: string }>;

export async function PATCH(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;
        const engineBlock = denyEngineUsers(auth);
        if (engineBlock) return engineBlock;

        if (auth.userRole !== "client") {
            return NextResponse.json({ error: "Only clients can stop milestones" }, { status: 403 });
        }

        const { milestoneId } = await params;
        const milestone = await milestoneController.stopMilestone(milestoneId, auth.userId);

        return NextResponse.json(milestone);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
