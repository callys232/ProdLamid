import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Project } from "@/lib/models/Project";

type Params = { params: Promise<{ id: string }> };

// Admin-only — checked on every request
async function guardAdmin(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  if (auth.userRole !== "admin") {
    return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
  }
  return auth;
}

export async function GET(request: NextRequest, { params }: Params) {
  const guard = await guardAdmin(request);
  if (guard instanceof NextResponse) return guard;

  try {
    await connectDB();
    const { id } = await params;

    const project = await Project.findById(id).lean() as any;
    if (!project) return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });

    // Return outreach data — stored on project or return mock structure
    return NextResponse.json({
      success: true,
      data: {
        campaigns:   project.outreach?.campaigns ?? [],
        keywords:    project.outreach?.keywords  ?? [],
        projectId:   id,
        projectTitle: project.title,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  const guard = await guardAdmin(request);
  if (guard instanceof NextResponse) return guard;

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { campaigns, keywords } = body;

    const project = await Project.findByIdAndUpdate(
      id,
      { $set: { "outreach.campaigns": campaigns, "outreach.keywords": keywords } },
      { new: true }
    ).lean() as any;

    if (!project) return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: project.outreach });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
