import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models/Project";
import { Bid } from "@/lib/models/Bid";
import type { Project as ProjectType } from "@/types/project";

/* -------- PREVENT STATIC BUILD EXECUTION -------- */

export const dynamic = "force-dynamic";

/* -------- GET PROJECT ANALYTICS -------- */

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        /* -------- CONNECT DATABASE -------- */

        await connectDB();

        /* -------- EXTRACT PARAMS -------- */

        const { id: projectId } = await context.params;

        if (!projectId) {
            return NextResponse.json(
                { success: false, message: "Project ID is required" },
                { status: 400 }
            );
        }

        /* -------- FETCH PROJECT -------- */

        const project = await Project.findById(projectId).lean<ProjectType | null>();

        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        /* -------- COUNT BIDS -------- */

        const bidsCount = await Bid.countDocuments({ projectId });

        /* -------- ANALYTICS OBJECT -------- */

        const analytics = {
            projectId,
            title: project.title,
            status: project.status,
            budget: project.budget ?? null,
            hourlyRate: project.hourlyRate ?? null,
            bidsCount,
            milestoneProgress: project.milestoneProgress ?? 0,
            milestonesTotal: project.milestones?.length ?? 0,
            consultantsCount: project.consultants?.length ?? 0,
            createdAt: project.createdAt ?? null,
            deadline: project.deadline ?? null,
            milestones: project.milestones || [],
            consultants: project.consultants || [],
        };

        /* -------- RESPONSE -------- */

        return NextResponse.json({
            success: true,
            data: analytics,
        });
    } catch (error) {
        console.error("Analytics API error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch project analytics",
            },
            { status: 500 }
        );
    }
}