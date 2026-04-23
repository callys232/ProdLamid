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
        const { searchParams } = new URL(request.url);
        const unreadOnly = searchParams.get("unread") === "true";

        const messages = await messageController.getMessages(id, unreadOnly, auth.userId);
        return NextResponse.json(messages);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
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
        const body = await request.json();
        
        const validatedData = MessageSchemaValidator.parse(body);
        const message = await messageController.sendMessage(id, auth.userId, validatedData);

        return NextResponse.json(message, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
