
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { projectId, action } = body; // action could be 'save' or 'unsave'

        if (!projectId) {
            return NextResponse.json(
                { error: "ProjectId is required" },
                { status: 400 }
            );
        }

        // In a real app, update the user's saved projects in the DB
        console.log(`User requested to ${action || "toggle save"} project ${projectId}`);

        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 200));

        return NextResponse.json({
            success: true,
            message: `Project ${action === 'unsave' ? 'removed from' : 'added to'} saved list`,
            isSaved: action !== 'unsave'
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update save status" },
            { status: 500 }
        );
    }
}
