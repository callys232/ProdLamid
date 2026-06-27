import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Users } from "@/lib/models/User";
import { scoreConsultant } from "@/lib/ai/matcher";
import type { Consultant, MatchResult, Project } from "@/types/aiMatch";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { userHasFeature } from "@/lib/services/tierService";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key_change_me";

function toNumber(value: unknown, fallback = 0) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "") {
        const n = Number(value);
        if (Number.isFinite(n)) return n;
    }
    return fallback;
}

function normalizeSkills(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value
        .map((s) => (typeof s === "string" ? s.trim() : ""))
        .filter(Boolean);
}

function buildProjectFromBody(body: any): Project {
    const source = body?.project && typeof body.project === "object" ? body.project : body;
    return {
        id: String(source?.id ?? body?.id ?? "draft"),
        title: String(source?.title ?? body?.title ?? "Untitled Project"),
        description: String(source?.description ?? body?.description ?? ""),
        skills: normalizeSkills(source?.skills ?? body?.skills),
    };
}

function buildConsultantFromUser(user: any): Consultant {
    const profile = user?.profile || {};
    const firstName = typeof profile.firstName === "string" ? profile.firstName : "";
    const lastName = typeof profile.lastName === "string" ? profile.lastName : "";
    const fullName = `${firstName} ${lastName}`.trim();

    return {
        id: user?._id?.toString?.() || String(user?.id || ""),
        name: fullName || user?.username || user?.email || "Unknown",
        email: user?.email,
        title: profile.title,
        skills: normalizeSkills(profile.skills),
        experienceYears: toNumber(profile.experience, 0),
        rating: toNumber(profile.rating, 0),
        completedProjects: toNumber(profile.completedProjects, 0),
        resumeUrl: profile.resumeUrl,
        portfolio: Array.isArray(profile.portfolio) ? profile.portfolio : undefined,
        uploadedProjects: Array.isArray(profile.uploadedProjects) ? profile.uploadedProjects : undefined,
    };
}

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        const project = buildProjectFromBody(body);

        const cookieStore = await cookies();
        let token = cookieStore.get("token")?.value;

        if (!token) {
            const authHeader = req.headers.get("Authorization");
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        if (token) {
            try {
                const decoded: any = jwt.verify(token, JWT_SECRET);
                if (decoded?.userId) {
                    const requester: any = await Users.findById(decoded.userId).lean();
                    if (requester) {
                        const allowed = await userHasFeature(decoded.userId, "ai_matching");
                        if (!allowed) {
                            return NextResponse.json(
                                { error: "Premium required for AI matching", code: "UPGRADE_REQUIRED" },
                                { status: 403 }
                            );
                        }
                    }
                }
            } catch { }
        }

        const consultantUsers = await Users.find({
            role: "seller",
            isVerified: true,
            accountDeleted: { $ne: true },
        })
            .populate({ path: "profile", strictPopulate: false })
            .select("email username profile")
            .limit(500)
            .lean();

        const results: MatchResult[] = consultantUsers.map((u: any) => {
            const consultant = buildConsultantFromUser(u);
            return {
                consultant,
                score: scoreConsultant(project, consultant),
            };
        });

        results.sort((a, b) => b.score.total - a.score.total);

        return NextResponse.json(results.slice(0, 20));
    } catch (error: any) {
        console.error("AI Match Error:", error);
        return NextResponse.json({ error: "Failed to match consultants" }, { status: 500 });
    }
}
