import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Invitation } from "@/lib/models/Invitation";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const invitedBy = searchParams.get("invitedBy");
        const consultantId = searchParams.get("consultantId");

        const query: any = {};
        if (invitedBy) query.invitedBy = invitedBy;
        if (consultantId) query.consultantId = consultantId;

        const invitations = await Invitation.find(query)
            .populate("consultantId", "firstName lastName email profile")
            .populate("projectId", "title")
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: invitations });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        const invitation = await Invitation.create(body);

        return NextResponse.json({ success: true, data: invitation }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
