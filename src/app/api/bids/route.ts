import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Bid } from "@/lib/models/Bid";
import { requireAuth } from "@/lib/middleware/auth";
import { deductPoints, POINT_COSTS } from "@/lib/services/pointsService";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get("projectId");
        const bidderId  = searchParams.get("bidderId");

        const query: any = {};
        if (projectId) query.projectId = projectId;
        if (bidderId)  query.bidderId  = bidderId;

        const bids = await Bid.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: bids });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        // Deduct points for placing a bid
        const pointsResult = await deductPoints(
            auth.userId,
            POINT_COSTS.PLACE_BID,
            "Bid placement fee",
        );
        if (!pointsResult.success) {
            return NextResponse.json(
                { success: false, message: pointsResult.message, code: "INSUFFICIENT_POINTS", balance: pointsResult.balance },
                { status: 402 }
            );
        }

        const body = await request.json();
        const bid  = await Bid.create({ ...body, bidderId: auth.userId });

        return NextResponse.json({ success: true, data: bid }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
