import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { ToolUsage } from "@/lib/models/ToolUsage";
import { verifyAuth } from "@/lib/middleware/auth";

/** Re-open a single stored run. Scoped to the owner — no cross-user reads. */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const auth = await verifyAuth(req);
    if (!auth?.userId) return NextResponse.json({ message: "Unauthorised." }, { status: 401 });

    const { id } = await ctx.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Not found." }, { status: 404 });
    }

    await dbConnect();

    // userId in the query is the authorisation check — never fetch then compare.
    const run = await ToolUsage.findOne({ _id: id, userId: auth.userId }).lean();
    if (!run) return NextResponse.json({ message: "Not found." }, { status: 404 });

    return NextResponse.json({ data: run });
  } catch {
    return NextResponse.json({ message: "Could not load run." }, { status: 500 });
  }
}

/** Delete a stored run — members control their own history. */
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const auth = await verifyAuth(req);
    if (!auth?.userId) return NextResponse.json({ message: "Unauthorised." }, { status: 401 });

    const { id } = await ctx.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Not found." }, { status: 404 });
    }

    await dbConnect();
    const res = await ToolUsage.deleteOne({ _id: id, userId: auth.userId });
    if (res.deletedCount === 0) return NextResponse.json({ message: "Not found." }, { status: 404 });

    return NextResponse.json({ message: "Deleted." });
  } catch {
    return NextResponse.json({ message: "Could not delete run." }, { status: 500 });
  }
}
