import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Team } from "@/lib/models/Team";

type Params = Promise<{ id: string }>;

// GET single team
export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        await connectDB();
        const { id } = await params;

        const team = await Team.findById(id).populate(
            "members.user",
            "firstName lastName email profile"
        );

        if (!team) {
            return NextResponse.json(
                { success: false, message: "Team not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: team });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// PUT update team
export async function PUT(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        const team = await Team.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        }).populate("members.user", "firstName lastName email profile");

        if (!team) {
            return NextResponse.json(
                { success: false, message: "Team not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: team });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// DELETE team
export async function DELETE(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        await connectDB();
        const { id } = await params;

        const team = await Team.findByIdAndDelete(id);

        if (!team) {
            return NextResponse.json(
                { success: false, message: "Team not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
