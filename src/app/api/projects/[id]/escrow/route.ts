import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models/Project";

type Params = Promise<{ id: string }>;

export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    const { id } = await params;

    try {
        await connectDB();

        const project: any = await Project.findById(id).lean();

        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        // Require authentication for private details
        const { requireAuth } = await import("@/lib/middleware/auth");
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        const isOwner = project.ownerId.toString() === auth.userId;
        const isConsultant = project.consultants.some((c: any) => 
            (c._id || c).toString() === auth.userId
        );

        if (!isOwner && !isConsultant) {
            return NextResponse.json(
                { success: false, message: "You are not authorized to view this project's escrow" },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                escrow: project.escrow || [],
                milestones: project.milestones || []
            }
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
