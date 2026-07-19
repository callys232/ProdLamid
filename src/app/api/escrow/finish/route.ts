import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Project } from "@/lib/models/Project";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        const { escrowId } = await request.json();

        if (!escrowId) {
            return NextResponse.json(
                { success: false, message: "escrowId is required" },
                { status: 400 }
            );
        }

        const project = await Project.findByIdAndUpdate(
            escrowId,
            { $set: { escrowStatus: "finished" } },
            { new: true }
        );

        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Work marked as finished. Awaiting client approval.",
            escrowStatus: project.escrowStatus,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
