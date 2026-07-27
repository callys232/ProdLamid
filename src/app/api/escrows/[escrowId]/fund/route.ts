import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";
import * as escrowController from "@/controllers/escrowController";
import { EscrowAccessError } from "@/lib/escrow/authorize";

type Params = Promise<{ escrowId: string }>;

export async function POST(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;
        const engineBlock = denyEngineUsers(auth);
        if (engineBlock) return engineBlock;

        if (auth.userRole !== "client") {
            return NextResponse.json({ error: "Only clients can fund escrows" }, { status: 403 });
        }

        const { escrowId } = await params;
        const result = await escrowController.fundEscrow(escrowId, auth.userId);

        return NextResponse.json(result);
    } catch (error: any) {
        if (error instanceof EscrowAccessError) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
