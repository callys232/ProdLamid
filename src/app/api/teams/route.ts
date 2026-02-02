
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Team } from "@/lib/models/Team";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const ownerId = searchParams.get("ownerId");

        const query: any = {};
        if (ownerId) query.ownerId = ownerId;

        // Populate members with user details
        const teams = await Team.find(query)
            .populate("members.user", "firstName lastName email profile") // basic user info
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: teams });
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

        const team = await Team.create(body);

        return NextResponse.json({ success: true, data: team }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
