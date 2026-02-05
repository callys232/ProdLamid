
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models/Project";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const teamId = searchParams.get("teamId");

        const query: any = {};
        if (teamId) query.teamId = teamId;

        const projects = await Project.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: projects });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const project = await Project.create(body);

        return NextResponse.json({ success: true, data: project }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
