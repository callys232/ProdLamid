import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { getActivities } from "@/lib/services/notificationService";

// GET /api/notifications/activities - Get activity notifications
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Require authentication
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) {
            return auth; // Return 401 response
        }

        const { searchParams } = new URL(request.url);
        const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20;

        const activities = await getActivities(auth.userId, limit);

        return NextResponse.json({
            success: true,
            data: activities
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
