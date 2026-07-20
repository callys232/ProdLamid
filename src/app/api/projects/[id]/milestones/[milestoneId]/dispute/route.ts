import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";
import * as milestoneController from "@/controllers/milestoneController";
import { DisputeSchemaValidator } from "@/lib/validation/validators";

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
            return NextResponse.json({ error: "Only clients can dispute milestones" }, { status: 403 });
        }

        const { milestoneId } = await params;
        const body = await request.json();
        const validatedData = DisputeSchemaValidator.parse(body);

        const milestone = await milestoneController.disputeMilestone(milestoneId, validatedData, auth.userId);

        return NextResponse.json(milestone);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
