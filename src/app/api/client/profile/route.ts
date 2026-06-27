import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { getClientProfile } from "@/lib/services/profileService";

// GET /api/client/profile - Get current user's profile
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Require authentication
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) {
            return auth; // Return 401 response
        }

        const profile = await getClientProfile(auth.userId);

        return NextResponse.json({
            success: true,
            data: profile
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
