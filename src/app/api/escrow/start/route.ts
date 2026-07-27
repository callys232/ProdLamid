import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";
import { Project } from "@/lib/models/Project";
import { Users } from "@/lib/models/User";
import { Organization } from "@/lib/models/Organization";
import { visibleEscrowUserIds } from "@/lib/escrow/authorize";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;
        const engineBlock = denyEngineUsers(auth);
        if (engineBlock) return engineBlock;

        const { escrowId, role } = await request.json();

        if (!escrowId) {
            return NextResponse.json(
                { success: false, message: "escrowId is required" },
                { status: 400 }
            );
        }

        /* This updated any project by id with no check that the caller had
           anything to do with it. Scoped to the owner and the assigned
           consultants; anyone else gets a 404 rather than a hint it exists. */
        const entitled = await visibleEscrowUserIds(auth.userId, auth.userRole, { Users, Organization });
        const project = await Project.findOneAndUpdate(
            {
                _id: escrowId,
                $or: [{ ownerId: { $in: entitled } }, { consultants: { $in: entitled } }],
            },
            { $set: { escrowStatus: "started" } },
            { new: true }
        );

        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: role === "consultant"
                ? "Contract started. Client notified to fund the milestone."
                : "Contract started. Please fund the current milestone.",
            escrowStatus: project.escrowStatus,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
