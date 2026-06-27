import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { createNotification } from "@/lib/services/notificationService";
import { getConsultantById } from "@/lib/services/consultantService";
import { Project } from "@/lib/models/Project";
import { Bid } from "@/lib/models/Bid";
import { emailConsultantHired } from "@/lib/services/transactionalEmailService";

// POST /api/hire-consultant - Formalize hiring
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Require authentication
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) {
            return auth; // Return 401 response
        }

        const body = await request.json();
        const { consultantId, projectId, bidId, clientMessage } = body;

        if (!consultantId || !projectId) {
            return NextResponse.json(
                { success: false, message: "Consultant ID and Project ID are required" },
                { status: 400 }
            );
        }

        // 1. Get project and verify ownership
        const project = await Project.findById(projectId);
        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        if (project.ownerId.toString() !== auth.userId) {
            return NextResponse.json(
                { success: false, message: "Only the project owner can hire consultants" },
                { status: 403 }
            );
        }

        // 2. Update Bid status if provided
        if (bidId) {
            await Bid.findByIdAndUpdate(bidId, { status: "accepted" });
            // Reject other bids for this project? (Optional, maybe keep them pending)
        }

        // 3. Add consultant to project
        if (!project.consultants.includes(consultantId)) {
            project.consultants.push(consultantId);
            project.status = "ongoing";
            await project.save();
        }

        // 4. Create notification + transactional email for consultant
        await createNotification({
            userId: consultantId,
            type: "message",
            title: "Project Hiring",
            message: clientMessage || `Congratulations! You have been hired for project: ${project.title}`,
            relatedId: projectId,
            relatedType: "project",
            severity: "High"
        });

        emailConsultantHired({
            consultantId,
            clientId:     auth.userId,
            projectTitle: project.title,
            projectId,
            clientMessage,
        }).catch(console.error);

        return NextResponse.json({
            success: true,
            message: "Consultant hired successfully",
            project
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
