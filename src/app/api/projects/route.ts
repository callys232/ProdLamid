import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models/Project";
import { requireAuth } from "@/lib/middleware/auth";
import { deductPoints, POINT_COSTS } from "@/lib/services/pointsService";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const teamId = searchParams.get("teamId");
        const role = searchParams.get("role"); // 'owner' or 'consultant'
        const scope = searchParams.get("scope"); // 'browse' for discovery

        const query: any = {};
        if (teamId) query.teamId = teamId;

        // Public browse scope - anyone can see open projects
        if (scope === "browse") {
            query.status = "open"; // Only 'open' is valid in current model enum
        } else {
            // Other scopes require authentication
            const auth = await requireAuth(request);
            if (auth instanceof NextResponse) return auth;

            if (role === "owner") {
                query.ownerId = auth.userId;
            } else if (role === "consultant") {
                query.consultants = auth.userId;
            } else if (!teamId) {
                query.$or = [
                    { ownerId: auth.userId },
                    { consultants: auth.userId }
                ];
            }
        }

        const page     = Math.max(1, Number(searchParams.get("page")  ?? 1));
        const limit    = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
        const category = searchParams.get("category");
        const status   = searchParams.get("status");
        const search   = searchParams.get("search");

        if (category) query.category = category;
        if (status)   query.status   = status;
        if (search)   query.title    = { $regex: search, $options: "i" };

        const [projects, total] = await Promise.all([
          Project.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
          Project.countDocuments(query),
        ]);

        return NextResponse.json({
          success: true,
          data: projects,
          pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        console.error("API Error in /api/projects GET:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Require authentication
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        // Deduct points for posting
        const pointsResult = await deductPoints(
            auth.userId,
            POINT_COSTS.POST_PROJECT,
            "Project posting fee",
        );
        if (!pointsResult.success) {
            return NextResponse.json(
                { success: false, message: pointsResult.message, code: "INSUFFICIENT_POINTS", balance: pointsResult.balance },
                { status: 402 }
            );
        }

        const body = await request.json();
        const { title, category, milestones: initialMilestones, workPhases, ...rest } = body;

        if (!title || !category) {
            return NextResponse.json(
                { success: false, message: "Title and Category are required" },
                { status: 400 }
            );
        }

        // 1. Create the project
        const project = await Project.create({
            title,
            category,
            workPhases: workPhases || [],
            ...rest,
            ownerId: auth.userId,
            status: "open"
        });

        // 2. If initial milestones are provided, create them in the separate collection
        if (initialMilestones && Array.isArray(initialMilestones)) {
            const { Milestone } = await import("@/lib/models/Milestone");
            const milestonesToCreate = initialMilestones.map((m: any) => ({
                projectId: project._id,
                title: m.title,
                description: m.description,
                amount: (m.amount || 0) * 100,
                status: "pending"
            }));
            await Milestone.insertMany(milestonesToCreate);
        }

        return NextResponse.json({ success: true, data: project }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
