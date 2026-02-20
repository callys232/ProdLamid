import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Invitation } from "@/lib/models/Invitation";

type Params = Promise<{ id: string }>;

// PATCH /api/invitations/[id] - Update invitation status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        const invitation = await Invitation.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!invitation) {
            return NextResponse.json(
                { success: false, message: "Invitation not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: invitation });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// DELETE /api/invitations/[id] - Cancel invitation
export async function DELETE(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        await connectDB();
        const { id } = await params;

        const invitation = await Invitation.findByIdAndDelete(id);

        if (!invitation) {
            return NextResponse.json(
                { success: false, message: "Invitation not found" },
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
