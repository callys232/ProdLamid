import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Users } from "@/lib/models/User";

export const dynamic = "force-dynamic";

// DELETE — submits an account deletion request for admin review.
// Immediate hard-deletion is disabled; only admins can approve deletions.
export async function DELETE(request: NextRequest) {
    try {
        await connectDB();
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        const user = await Users.findById(auth.userId).select("deletionRequest");
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        if (user.deletionRequest?.status === "pending") {
            return NextResponse.json({
                success: false,
                message: "A deletion request is already pending. Our team will review it within 48 hours.",
            }, { status: 409 });
        }

        await Users.findByIdAndUpdate(auth.userId, {
            "deletionRequest.requested":   true,
            "deletionRequest.requestedAt": new Date(),
            "deletionRequest.status":      "pending",
        });

        return NextResponse.json({
            success: true,
            message: "Account deletion request submitted. Our team will review and process it within 48 hours.",
        });
    } catch (error) {
        console.error("Delete account error:", error);
        return NextResponse.json({ success: false, message: "Failed to submit deletion request" }, { status: 500 });
    }
}
