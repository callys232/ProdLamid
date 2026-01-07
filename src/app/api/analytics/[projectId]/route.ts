import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models/Project";
import { Bid } from "@/lib/models/Bid";

export async function GET(
    request: NextRequest,
    { params }: { params: { projectId: string } }
) {
    try {
        await connectDB();

        const { projectId } = params;
        const project = await Project.findById(projectId).lean();

        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        // Get bids count
        const bidsCount = await Bid.countDocuments({ projectId });

        // Calculate basic analytics
        const analytics = {
            projectId,
            title: project.title,
            status: project.status,
            budget: project.budget,
            hourlyRate: project.hourlyRate,
            bidsCount,
            milestoneProgress: project.milestoneProgress || 0,
            milestonesTotal: project.milestones?.length || 0,
            consultantsCount: project.consultants?.length || 0,
            createdAt: project.createdAt,
            deadline: project.deadline
        };

        return NextResponse.json({
            success: true,
            data: analytics
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
