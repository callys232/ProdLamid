import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import * as bidController from "@/controllers/bidController";

type Params = Promise<{ id: string; bidId: string }>;

export async function PATCH(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        if (auth.userRole !== "client") {
            return NextResponse.json({ error: "Only clients can accept bids" }, { status: 403 });
        }

        const { id, bidId } = await params;
        const result = await bidController.acceptBid(id, bidId, auth.userId);

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
