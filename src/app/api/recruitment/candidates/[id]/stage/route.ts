import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Candidate } from "@/lib/models/Candidate";
import { Users } from "@/lib/models/User";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

const ENTERPRISE_TYPES = ["Enterprise", "Concierge", "Admin"];
const VALID_STAGES = ["applied", "screening", "interview", "offer", "hired", "rejected", "withdrawn"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const userData = await Users.findById(auth.userId).select("accountType").lean() as { accountType?: string } | null;
    if (!userData || !ENTERPRISE_TYPES.includes(userData.accountType ?? "")) {
      return NextResponse.json({ success: false, message: "Enterprise access required" }, { status: 403 });
    }

    const { id }       = await params;
    const { stage, notes } = await req.json();

    if (!stage || !VALID_STAGES.includes(stage)) {
      return NextResponse.json({
        success: false,
        message: `stage must be one of: ${VALID_STAGES.join(", ")}`,
      }, { status: 400 });
    }

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return NextResponse.json({ success: false, message: "Candidate not found" }, { status: 404 });
    }

    candidate.pipelineStage = stage;
    candidate.stageHistory.push({
      stage,
      movedAt: new Date(),
      movedBy: auth.userId as unknown as import("mongoose").Types.ObjectId,
      notes:   notes ?? "",
    });

    await candidate.save();
    return NextResponse.json({ success: true, data: candidate });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
