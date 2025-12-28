
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, amount, timeline, projectId } = body;

        // Validate required fields
        if (!name || !email || !amount || !timeline) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // In a real app, we would save this to the database, upload CV, etc.
        console.log(`Received application for project ${projectId || "unknown"}:`, {
            name,
            email,
            amount,
            timeline,
        });

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return NextResponse.json({
            success: true,
            message: "Application submitted successfully",
            data: {
                applicationId: "app_" + Date.now(),
                status: "pending",
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to process application" },
            { status: 500 }
        );
    }
}
