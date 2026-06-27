import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Bid } from "@/lib/models/Bid";
import { Project } from "@/lib/models/Project";
import { Notification } from "@/lib/models/Notification";
import { requireAuth } from "@/lib/middleware/auth";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Require authentication
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        const body = await request.json();
        const { projectId, amount, coverLetter, timeline } = body;

        // Validate required fields
        if (!projectId || !amount || !coverLetter) {
            return NextResponse.json(
                { success: false, message: "Missing required fields: projectId, amount, or coverLetter" },
                { status: 400 }
            );
        }

        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        // Create Bid
        const bid = await Bid.create({
            projectId,
            bidderId: auth.userId,
            amount,
            duration: timeline || "Not specified",
            coverLetter,
            status: "pending",
        });

        // Notify project owner
        await Notification.create({
            user: project.ownerId,
            title: "New Project Application",
            message: `You have received a new bid of $${amount} for your project: ${project.title}.`,
            type: "activity",
            severity: "Medium",
            relatedId: projectId,
            relatedType: "project",
        });

        return NextResponse.json({
            success: true,
            message: "Application submitted successfully",
            data: bid
        });
    } catch (error: any) {
        console.error("Apply error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to process application" },
            { status: 500 }
        );
    }
}
