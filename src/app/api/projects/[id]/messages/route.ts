import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import * as messageController from "@/controllers/messageController";
import { MessageSchemaValidator } from "@/lib/validation/validators";

type Params = Promise<{ id: string }>;

export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        const { id } = await params;

        // Check project authorization
        const { Project } = await import("@/lib/models/Project");
        const project = await Project.findById(id).lean();
        if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

        const isOwner = project.ownerId.toString() === auth.userId;
        const isConsultant = project.consultants.some((c: any) => c.toString() === auth.userId);

        if (!isOwner && !isConsultant) {
            return NextResponse.json({ error: "Unauthorized access to project messages" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const unreadOnly = searchParams.get("unread") === "true";

        const messages = await messageController.getMessages(id, unreadOnly, auth.userId);
        return NextResponse.json({ success: true, data: messages });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        const { id } = await params;

        // Check project authorization
        const { Project } = await import("@/lib/models/Project");
        const project = await Project.findById(id).lean();
        if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

        const isOwner = project.ownerId.toString() === auth.userId;
        const isConsultant = project.consultants.some((c: any) => c.toString() === auth.userId);

        if (!isOwner && !isConsultant) {
            return NextResponse.json({ error: "Unauthorized: You are not part of this project" }, { status: 403 });
        }

        const body = await request.json();
        
        const validatedData = MessageSchemaValidator.parse(body);
        const message = await messageController.sendMessage(id, auth.userId, validatedData);

        return NextResponse.json({ success: true, data: message }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
