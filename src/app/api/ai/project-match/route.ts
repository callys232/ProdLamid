import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Users } from "@/lib/models/User";
import { Project } from "@/lib/models/Project";
import { scoreProject } from "@/lib/ai/projectMatcher";
import type { ConsultantProfile, ProjectMatchResult } from "@/types/aiProjectmatch";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key_change_me";

function normalizeSkills(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value
        .map((s) => (typeof s === "string" ? s.trim() : ""))
        .filter(Boolean);
}

function toNumber(value: unknown, fallback = 0) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "") {
        const n = Number(value);
        if (Number.isFinite(n)) return n;
    }
    return fallback;
}

async function getToken(req: Request) {
    const cookieStore = await cookies();
    let token = cookieStore.get("token")?.value;

    if (!token) {
        const authHeader = req.headers.get("Authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
    }

    return token;
}

function buildConsultantProfile(user: any): ConsultantProfile {
    const profile = user?.profile || {};
    const firstName = typeof profile.firstName === "string" ? profile.firstName : "";
    const lastName = typeof profile.lastName === "string" ? profile.lastName : "";
    const fullName = `${firstName} ${lastName}`.trim();

    return {
        id: user?._id?.toString?.() || String(user?.id || ""),
        name: fullName || user?.username || user?.email || "Unknown",
        email: user?.email,
        skills: normalizeSkills(profile.skills),
        experienceYears: toNumber(profile.experience, 0),
        rating: toNumber(profile.rating, 0),
        completedProjects: toNumber(profile.completedProjects, 0),
        resumeText: typeof profile.bio === "string" ? profile.bio : undefined,
        portfolioText: typeof profile.portfolioText === "string" ? profile.portfolioText : undefined,
    };
}

function normalizeIncomingProject(raw: any) {
    const skills = normalizeSkills(raw?.skills);
    const createdAt = raw?.createdAt ?? raw?.created_at;

    return {
        id: String(raw?.id ?? raw?._id ?? ""),
        title: String(raw?.title ?? "Untitled Project"),
        description: String(raw?.description ?? ""),
        skills,
        budget: typeof raw?.budget === "number" ? raw.budget : raw?.budget ? Number(raw.budget) : undefined,
        hourlyRate: typeof raw?.hourlyRate === "number" ? raw.hourlyRate : raw?.hourlyRate ? Number(raw.hourlyRate) : undefined,
        type: raw?.type as any,
        location: raw?.location,
        createdAt: createdAt ? String(createdAt) : undefined,
        categories: String(raw?.categories ?? raw?.category ?? "Unspecified"),
    };
}

export async function POST(req: Request) {
    try {
        await connectDB();

        const token = await getToken(req);
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (e: any) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await Users.findById(decoded.userId)
            .populate({ path: "profile", strictPopulate: false })
            .lean();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (user.role !== "seller") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const profile: any = (user as any).profile || {};
        if ((user as any).isPremium === false || profile.premium === false) {
            return NextResponse.json({ error: "Premium required" }, { status: 403 });
        }

        const body = await req.json().catch(() => ({}));
        const incomingProjects = Array.isArray(body?.projects) ? body.projects : null;

        const consultant = buildConsultantProfile(user);

        let projectsToScore: any[] = [];

        if (incomingProjects && incomingProjects.length > 0) {
            projectsToScore = incomingProjects;
        } else {
            const filters = body?.filters || {};
            const query: any = { status: "open" };
            if (filters?.category && filters.category !== "All") query.category = filters.category;
            if (filters?.tech && filters.tech !== "All") query.tech = filters.tech;
            if (filters?.location && filters.location !== "All") query.location = filters.location;
            if (filters?.search && typeof filters.search === "string" && filters.search.trim() !== "") {
                query.title = { $regex: filters.search.trim(), $options: "i" };
            }

            const dbProjects = await Project.find(query).sort({ createdAt: -1 }).limit(200).lean();
            projectsToScore = dbProjects;
        }

        const results: ProjectMatchResult[] = projectsToScore.map((raw) => {
            const project = normalizeIncomingProject(raw);
            return { project, score: scoreProject(project as any, consultant) };
        });

        results.sort((a, b) => b.score.total - a.score.total);

        return NextResponse.json(results.slice(0, 20));
    } catch (error: any) {
        console.error("AI Project Match Error:", error);
        return NextResponse.json({ error: "Failed to match projects" }, { status: 500 });
    }
}
