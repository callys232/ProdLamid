import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import * as milestoneController from "@/controllers/milestoneController";
import { emailMilestoneApproved } from "@/lib/services/transactionalEmailService";

type Params = Promise<{ id: string; milestoneId: string }>;

export async function PATCH(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        if (auth.userRole !== "client") {
            return NextResponse.json({ error: "Only clients can approve milestones" }, { status: 403 });
        }

        const { id: projectId, milestoneId } = await params;
        const result = await milestoneController.approveMilestone(milestoneId, auth.userId);

        // Escrow not yet funded — ask client to fund first
        if (!result.success && result.requireFunding) {
            return NextResponse.json(result, { status: 402 });
        }

        // Happy path: result.milestone is the approved Mongoose doc
        const milestone = result.milestone;

        // Fire transactional email (non-blocking)
        if (milestone?.consultantId) {
            emailMilestoneApproved({
                consultantId:   String(milestone.consultantId),
                milestoneTitle: milestone.title ?? "Milestone",
                projectTitle:   milestone.projectTitle ?? "",
                amount:         milestone.amount ?? 0,
                projectId,
            }).catch(console.error);
        }

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
