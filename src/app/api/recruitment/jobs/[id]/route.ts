import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { JobOpening } from "@/lib/models/JobOpening";
import { Users } from "@/lib/models/User";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

const ENTERPRISE_TYPES = ["Enterprise", "Concierge", "Admin"];

export async function GET(
  _req: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();
    const { id } = await params;
    const job = await JobOpening.findById(id).lean();
    if (!job) {
      return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: job });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

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

    const { id } = await params;
    const body   = await req.json();
    const job    = await JobOpening.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!job) {
      return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: job });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

export async function DELETE(
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

    const { id } = await params;
    const job    = await JobOpening.findByIdAndDelete(id);
    if (!job) {
      return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
