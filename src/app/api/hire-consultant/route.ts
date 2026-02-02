import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { createNotification } from "@/lib/services/notificationService";
import { getConsultantById } from "@/lib/services/consultantService";

// POST /api/hire-consultant - Send hire request
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Require authentication
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) {
            return auth; // Return 401 response
        }

        const body = await request.json();
        const { consultantId, consultantEmail, clientMessage } = body;

        if (!consultantId) {
            return NextResponse.json(
                { success: false, message: "Consultant ID is required" },
                { status: 400 }
            );
        }

        // Get consultant details
        const consultant = await getConsultantById(consultantId);
        if (!consultant) {
            return NextResponse.json(
                { success: false, message: "Consultant not found" },
                { status: 404 }
            );
        }

        // Create notification for consultant
        await createNotification({
            userId: consultantId,
            type: "message",
            title: "New Hire Request",
            message: clientMessage || `You have received a hire request from a client.`,
            relatedId: auth.userId,
            relatedType: "consultant",
            severity: "Medium"
        });

        // TODO: Send email notification to consultant
        // await sendEmail({
        //     to: consultantEmail || consultant.email,
        //     subject: "New Hire Request",
        //     body: clientMessage || "You have received a hire request"
        // });

        return NextResponse.json({
            success: true,
            message: "Hire request sent successfully"
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
