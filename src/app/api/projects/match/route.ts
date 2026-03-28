import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models/Project";
import { Users } from "@/lib/models/User";
import { scoreProject } from "@/lib/ai/projectMatcher";

export async function GET() {
    try {
        await connectDB();

        /* 🔐 TODO: Replace with auth user */
        const consultant = await Users.findOne({ role: "consultant" });

        if (!consultant) {
            return NextResponse.json({ error: "No consultant found" }, { status: 404 });
        }

        const projects = await Project.find({ status: "open" }).limit(100);

        const results = projects.map((p: any) => ({
            project: {
                id: p._id.toString(),
                title: p.title,
                description: p.description,
                skills: p.skills || [],
                budget: p.budget,
                hourlyRate: p.hourlyRate,
                type: p.type,
                location: p.location,
                createdAt: p.createdAt,
            },
            score: scoreProject(p, {
                id: consultant._id.toString(),
                name: consultant.name,
                email: consultant.email,
                skills: consultant.skills || [],
                experienceYears: consultant.experience || 0,
                rating: consultant.rating,
                resumeText: consultant.resumeText,
                portfolioText: consultant.portfolioText,
            }),
        }));

        results.sort((a, b) => b.score.total - a.score.total);

        return NextResponse.json(results.slice(0, 20));
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Match failed" }, { status: 500 });
    }
}