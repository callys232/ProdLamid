import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models/Project";

export async function POST(request: Request) {
    try {
        await connectDB();
        const { escrowId, role } = await request.json();

        if (!escrowId) {
            return NextResponse.json(
                { success: false, message: "escrowId is required" },
                { status: 400 }
            );
        }

        const project = await Project.findByIdAndUpdate(
            escrowId,
            { $set: { escrowStatus: "in_progress" } },
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
            message: role === "consultant"
                ? "Contract started. Client notified to fund the milestone."
                : "Contract started. Please fund the current milestone.",
            escrowStatus: project.escrowStatus,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
