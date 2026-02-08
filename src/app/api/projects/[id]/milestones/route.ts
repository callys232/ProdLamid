import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models/Project";
import { requireAuth } from "@/lib/middleware/auth";

type Params = Promise<{ id: string }>;

// GET project milestones
export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        await connectDB();
        const { id } = await params;

        const project: any = await Project.findById(id).lean();

        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: project.milestones || [],
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// POST create milestone
export async function POST(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        await connectDB();

        // Require authentication
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        const { id } = await params;

        // Verify ownership
        const project = await Project.findById(id);
        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        if (project.ownerId.toString() !== auth.userId) {
            return NextResponse.json(
                { success: false, message: "Only the project owner can create milestones" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { title, description, amount, dueDate, deadline } = body;

        if (!title) {
            return NextResponse.json(
                { success: false, message: "Milestone title is required" },
                { status: 400 }
            );
        }

        const milestone = {
            id: new Date().getTime().toString(),
            title,
            description,
            amount,
            dueDate,
            deadline,
            progress: 0,
            status: "pending",
        };

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { $push: { milestones: milestone } },
            { new: true }
        );

        return NextResponse.json(
            { success: true, data: milestone },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
