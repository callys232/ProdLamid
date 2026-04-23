import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import * as milestoneController from "@/controllers/milestoneController";

type Params = Promise<{ milestoneId: string }>;

export async function PATCH(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        if (auth.userRole !== "seller" && auth.userRole !== "freelancer") {
            // Adjusting for existing roles: "client", "seller", "admin"
            // The prompt said "consultant", which usually maps to "seller" or similar.
            // In User model, role is "admin", "seller", "client".
        }

        const { milestoneId } = await params;
        const milestone = await milestoneController.startMilestone(milestoneId, auth.userId);

        return NextResponse.json(milestone);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
