
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Bid } from "@/lib/models/Bid";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get("projectId");
        const bidderId = searchParams.get("bidderId");

        const query: any = {};
        if (projectId) query.projectId = projectId;
        if (bidderId) query.bidderId = bidderId;

        const bids = await Bid.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: bids });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        // Basic validation could go here

        const bid = await Bid.create(body);

        return NextResponse.json({ success: true, data: bid }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
