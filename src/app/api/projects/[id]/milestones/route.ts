import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models/Project";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const project = await Project.findById(params.id).lean();

        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: project.milestones || []
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

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
            status: "pending"
        };

        const project = await Project.findByIdAndUpdate(
            params.id,
            { $push: { milestones: milestone } },
            { new: true }
        );

        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

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
