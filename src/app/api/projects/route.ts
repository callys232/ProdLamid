import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models/Project";
import { requireAuth } from "@/lib/middleware/auth";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const teamId = searchParams.get("teamId");
        const role = searchParams.get("role"); // 'owner' or 'consultant'
        const scope = searchParams.get("scope"); // 'browse' for discovery

        const query: any = {};
        if (teamId) query.teamId = teamId;

        // Public browse scope - anyone can see open projects
        if (scope === "browse") {
            query.status = "open"; // Only 'open' is valid in current model enum
        } else {
            // Other scopes require authentication
            const auth = await requireAuth(request);
            if (auth instanceof NextResponse) return auth;

            if (role === "owner") {
                query.ownerId = auth.userId;
            } else if (role === "consultant") {
                query.consultants = auth.userId;
            } else if (!teamId) {
                query.$or = [
                    { ownerId: auth.userId },
                    { consultants: auth.userId }
                ];
            }
        }

        const projects = await Project.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: projects });
    } catch (error: any) {
        console.error("API Error in /api/projects GET:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Require authentication
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        const body = await request.json();

        if (!body.title || !body.category) {
            return NextResponse.json(
                { success: false, message: "Title and Category are required" },
                { status: 400 }
            );
        }

        // Auto-assign owner
        const project = await Project.create({
            ...body,
            ownerId: auth.userId
        });

        return NextResponse.json({ success: true, data: project }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
