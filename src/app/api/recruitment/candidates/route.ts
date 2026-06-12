import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Candidate } from "@/lib/models/Candidate";
import { JobOpening } from "@/lib/models/JobOpening";
import { Users } from "@/lib/models/User";

export const dynamic = "force-dynamic";

const ENTERPRISE_TYPES = ["Enterprise", "Concierge", "Admin"];

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const userData = await Users.findById(auth.userId).select("accountType").lean() as { accountType?: string } | null;
    if (!userData || !ENTERPRISE_TYPES.includes(userData.accountType ?? "")) {
      return NextResponse.json({ success: false, message: "Enterprise access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const jobId  = searchParams.get("jobId");
    const stage  = searchParams.get("stage");
    const status = searchParams.get("status") ?? "active";

    const query: Record<string, unknown> = { status };
    if (jobId) query.jobOpeningId = jobId;
    if (stage) query.pipelineStage = stage;

    const candidates = await Candidate.find(query)
      .populate({ path: "jobOpeningId", select: "title department", strictPopulate: false })
      .populate({ path: "assignedTo", select: "username email", strictPopulate: false })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: candidates });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const contentType = req.headers.get("content-type") ?? "";

    let fields: Record<string, string> = {};
    let cvUrl: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      for (const [key, value] of formData.entries()) {
        if (typeof value === "string") {
          fields[key] = value;
        } else {
          // File upload
          const file  = value as File;
          const ext   = path.extname(file.name) || ".pdf";
          const fname = `cv_${Date.now()}${ext}`;
          const dest  = path.join(process.cwd(), "public", "uploads", fname);
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          const buffer = Buffer.from(await file.arrayBuffer());
          fs.writeFileSync(dest, buffer);
          cvUrl = `/uploads/${fname}`;
        }
      }
    } else {
      fields = await req.json();
    }

    const {
      fullName, email, phone, country, linkedIn,
      currentRole, yearsExperience, industry, skills,
      motivation, comments, source, jobOpeningId, userId,
    } = fields as Record<string, string>;

    if (!fullName || !email) {
      return NextResponse.json({ success: false, message: "fullName and email are required" }, { status: 400 });
    }

    const skillsArr = typeof skills === "string"
      ? skills.split(",").map((s: string) => s.trim()).filter(Boolean)
      : (Array.isArray(skills) ? skills : []);

    const candidate = await Candidate.create({
      fullName,
      email:           email.toLowerCase(),
      phone,
      country,
      linkedIn,
      currentRole,
      yearsExperience: yearsExperience ? Number(yearsExperience) : undefined,
      industry,
      skills:          skillsArr,
      cvUrl,
      motivation,
      comments,
      source:          source ?? "direct",
      jobOpeningId:    jobOpeningId || undefined,
      userId:          userId      || undefined,
      pipelineStage:   "applied",
      stageHistory: [{
        stage:   "applied",
        movedAt: new Date(),
        notes:   "Initial application",
      }],
    });

    if (jobOpeningId) {
      await JobOpening.findByIdAndUpdate(jobOpeningId, { $inc: { applicantCount: 1 } });
    }

    return NextResponse.json({ success: true, data: candidate }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
