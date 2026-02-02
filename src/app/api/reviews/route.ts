import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getReviews, createReview } from "@/lib/services/reviewService";
import { requireAuth } from "@/lib/middleware/auth";

// GET /api/reviews - Get reviews with optional filters
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get("projectId") || undefined;
        const consultantId = searchParams.get("consultantId") || undefined;
        const minRating = searchParams.get("minRating") ? parseInt(searchParams.get("minRating")!) : undefined;
        const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20;
        const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0;

        const result = await getReviews({
            projectId,
            consultantId,
            minRating,
            limit,
            offset
        });

        return NextResponse.json({
            success: true,
            data: result.reviews,
            total: result.total,
            limit: result.limit,
            offset: result.offset
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// POST /api/reviews - Create a new review (requires auth)
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Require authentication
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) {
            return auth; // Return 401 response
        }

        const body = await request.json();
        const { projectId, consultantId, rating, comment, reviewerName } = body;

        if (!rating || !comment) {
            return NextResponse.json(
                { success: false, message: "Rating and comment are required" },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { success: false, message: "Rating must be between 1 and 5" },
                { status: 400 }
            );
        }

        const review = await createReview({
            projectId,
            consultantId,
            userId: auth.userId,
            rating,
            comment,
            reviewerName
        });

        return NextResponse.json(
            { success: true, data: review },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
