import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models/Project";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";

type Params = Promise<{ id: string }>;

// GET project details
export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        await connectDB();
        const { id } = await params;

        const project = await Project.findById(id)
            .populate("consultants")
            .lean();

        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        // Require authentication for private details
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;
        const engineBlock = denyEngineUsers(auth);
        if (engineBlock) return engineBlock;

        const isOwner = (project as any).ownerId.toString() === auth.userId;
        const isConsultant = (project as any).consultants.some((c: any) =>
            (c._id || c).toString() === auth.userId
        );

        if (!isOwner && !isConsultant) {
            return NextResponse.json(
                { success: false, message: "You are not authorized to view this project's workspace" },
                { status: 403 }
            );
        }

        return NextResponse.json({ success: true, data: project });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// PUT update project details
export async function PUT(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        await connectDB();

        // Require authentication
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;
        const engineBlock = denyEngineUsers(auth);
        if (engineBlock) return engineBlock;

        const { id } = await params;
        const body = await request.json();

        // Verify ownership
        const project = await Project.findById(id);
        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        if ((project as any).ownerId.toString() !== auth.userId) {
            return NextResponse.json(
                { success: false, message: "Only the project owner can update this project" },
                { status: 403 }
            );
        }

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        return NextResponse.json({ success: true, data: updatedProject });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// DELETE project
export async function DELETE(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        await connectDB();

        // Require authentication
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;
        const engineBlock2 = denyEngineUsers(auth);
        if (engineBlock2) return engineBlock2;

        const { id } = await params;

        // Verify ownership
        const project = await Project.findById(id);
        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        if ((project as any).ownerId.toString() !== auth.userId) {
            return NextResponse.json(
                { success: false, message: "Only the project owner can delete this project" },
                { status: 403 }
            );
        }

        await Project.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
