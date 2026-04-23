import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import * as escrowController from "@/controllers/escrowController";

type Params = Promise<{ escrowId: string }>;

export async function PATCH(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        if (auth.userRole !== "client") {
            return NextResponse.json({ error: "Only clients can cancel escrows" }, { status: 403 });
        }

        const { escrowId } = await params;
        const result = await escrowController.cancelEscrow(escrowId, auth.userId);

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
