import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models/Project";

export async function POST(request: Request) {
    try {
        await connectDB();
        const { escrowId, reason } = await request.json();

        if (!escrowId) {
            return NextResponse.json(
                { success: false, message: "escrowId is required" },
                { status: 400 }
            );
        }

        if (!reason || !reason.trim()) {
            return NextResponse.json(
                { success: false, message: "A dispute reason is required" },
                { status: 400 }
            );
        }

        const project = await Project.findByIdAndUpdate(
            escrowId,
            { $set: { escrowStatus: "disputed", disputeReason: reason.trim() } },
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
            message: "Dispute filed. Our team will review within 24 hours.",
            escrowStatus: project.escrowStatus,
            disputeReason: project.disputeReason,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
