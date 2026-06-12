import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { JobOpening } from "@/lib/models/JobOpening";
import { Project } from "@/lib/models/Project";
import { Users } from "@/lib/models/User";

export const dynamic = "force-dynamic";

const ENTERPRISE_TYPES = ["Enterprise", "Concierge", "Admin"];

const TYPE_MAP: Record<string, string> = {
  "Full Time":  "full-time",
  "full-time":  "full-time",
  "Part Time":  "part-time",
  "part-time":  "part-time",
  "Contract":   "contract",
  "contract":   "contract",
  "Freelance":  "freelance",
  "freelance":  "freelance",
  "Internship": "internship",
  "internship": "internship",
};

const DELIVERY_VALUES = ["Remote", "Onsite", "Hybrid"];

function categoryToTrack(category: string): string {
  const c = (category ?? "").toLowerCase();
  if (c.includes("leadership") || c.includes("executive") || c.includes("management"))
    return "Leadership Development";
  if (c.includes("project") || c.includes("scrum") || c.includes("agile") || c.includes("pmo"))
    return "Project Management";
  if (c.includes("sales") || c.includes("business development") || c.includes("commercial"))
    return "Sales Enablement";
  if (c.includes("digital") || c.includes("tech") || c.includes("software") || c.includes("data") || c.includes("it "))
    return "Digital Transformation";
  return "General";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normaliseProject(p: any): Record<string, unknown> {
  const delivery = DELIVERY_VALUES.includes(p.location) ? p.location : "Remote";
  const location = DELIVERY_VALUES.includes(p.location) ? undefined : p.location;

  return {
    _id:            p._id.toString(),
    title:          p.title,
    department:     p.category || p.organization || "General",
    track:          categoryToTrack(p.category ?? ""),
    type:           TYPE_MAP[p.type ?? ""] ?? "contract",
    delivery,
    location,
    description:    p.description,
    requirements:   [],
    skills:         Array.isArray(p.skills) ? p.skills : (p.tech ? [p.tech] : []),
    salaryRange:    p.suggestedBidRange?.min
                      ? { min: p.suggestedBidRange.min, max: p.suggestedBidRange.max, currency: "USD" }
                      : p.budget
                      ? { min: p.budget, currency: "USD" }
                      : undefined,
    status:         "open",
    applicantCount: 0,
    deadline:       p.deadline ?? undefined,
    source:         "project",
    createdAt:      p.createdAt,
  };
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const track    = searchParams.get("track");
    const type     = searchParams.get("type");
    const delivery = searchParams.get("delivery");
    const search   = searchParams.get("q");

    // ── JobOpenings ──
    const jobQuery: Record<string, unknown> = { status: "open" };
    if (track)    jobQuery.track    = track;
    if (type)     jobQuery.type     = type;
    if (delivery) jobQuery.delivery = delivery;
    if (search) {
      jobQuery.$or = [
        { title:      { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { skills:     { $regex: search, $options: "i" } },
      ];
    }
    const jobOpenings = await JobOpening.find(jobQuery).sort({ createdAt: -1 }).lean();

    // ── Open Projects ──
    const projectQuery: Record<string, unknown> = { status: "open" };
    if (search) {
      projectQuery.$or = [
        { title:       { $regex: search, $options: "i" } },
        { category:    { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skills:      { $regex: search, $options: "i" } },
      ];
    }
    const rawProjects = await Project.find(projectQuery).sort({ createdAt: -1 }).lean();
    const projects    = rawProjects.map(normaliseProject);

    // Apply delivery / type filters to projects client-side after normalise
    const filteredProjects = projects.filter((p) => {
      if (delivery && p.delivery !== delivery) return false;
      if (type     && p.type     !== type)     return false;
      if (track    && p.track    !== track)    return false;
      return true;
    });

    // Merge — JobOpenings first, then Projects
    const data = [
      ...jobOpenings.map((j) => ({ ...j, source: "job" })),
      ...filteredProjects,
    ];

    return NextResponse.json({ success: true, data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const userData = await Users.findById(auth.userId).select("accountType").lean() as { accountType?: string } | null;
    if (!userData || !ENTERPRISE_TYPES.includes(userData.accountType ?? "")) {
      return NextResponse.json({ success: false, message: "Enterprise access required" }, { status: 403 });
    }

    const body = await req.json();
    const job  = await JobOpening.create({ ...body, postedBy: auth.userId });
    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
