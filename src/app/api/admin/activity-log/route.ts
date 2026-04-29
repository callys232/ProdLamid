import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (auth.userRole !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const page  = Math.max(1, Number(searchParams.get("page")  ?? 1));
    const limit = Math.min(100, Number(searchParams.get("limit") ?? 20));

    // Dynamically import to avoid circular deps
    const mongoose = (await import("mongoose")).default;
    const ActivityLog = mongoose.models.ActivityLog ||
      mongoose.model("ActivityLog", new mongoose.Schema({ action: String, userId: mongoose.Schema.Types.ObjectId, meta: mongoose.Schema.Types.Mixed, createdAt: Date }, { timestamps: true }));

    const [logs, total] = await Promise.all([
      ActivityLog.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      ActivityLog.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
