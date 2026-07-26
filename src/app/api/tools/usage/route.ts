import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { ToolUsage } from "@/lib/models/ToolUsage";
import { verifyAuth } from "@/lib/middleware/auth";

/* verifyAuth handles both token shapes in use (login emits `userId`,
   signAccessToken emits `sub`) and honours the revocation blocklist. */
async function getUserId(req: NextRequest): Promise<string | null> {
  const auth = await verifyAuth(req);
  return auth?.userId ?? null;
}

/* Demo and dev accounts are authenticated by a signed token but have no
   database record, and their IDs are not ObjectIds. Querying ToolUsage with
   one throws a CastError, which surfaced as a 500 on every history read. */
const isPersistableUser = (userId: string) =>
  mongoose.Types.ObjectId.isValid(userId);

/** Record a completed tool run. Members only — visitors never reach a result. */
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthorised." }, { status: 401 });

    // Demo sessions run tools freely; there is just nowhere to file the record.
    if (!isPersistableUser(userId)) {
      return NextResponse.json({ message: "Not recorded for demo accounts." }, { status: 202 });
    }

    const { moduleId, engineName, seriesName, organisationName, href, result } = await req.json();
    if (!moduleId || !engineName) {
      return NextResponse.json({ message: "moduleId and engineName are required." }, { status: 400 });
    }

    // Flatten dimension scores so trend queries don't have to load full results.
    const scores = Array.isArray(result?.dimensions)
      ? result.dimensions
          .filter((d: any) => d && typeof d.label === "string" && Number.isFinite(Number(d.value)))
          .map((d: any) => ({ label: String(d.label).slice(0, 80), value: Number(d.value) }))
          .slice(0, 12)
      : [];

    await dbConnect();
    await ToolUsage.create({
      userId,
      moduleId,
      engineName,
      seriesName,
      organisationName,
      href,
      result: result ?? undefined,
      scores,
      runAt: new Date(),
    });

    return NextResponse.json({ message: "Recorded." }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Could not record tool usage." }, { status: 500 });
  }
}

/**
 * This member's tool history, newest first.
 *
 *   ?moduleId=C03   restrict to one module (powers run-over-run comparison)
 *   ?full=1         include the stored result payload
 *   ?limit=n        cap results (default 25, max 100)
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthorised." }, { status: 401 });

    // Demo accounts have no stored history — an empty list, not an error.
    if (!isPersistableUser(userId)) {
      return NextResponse.json({ data: [], totalRuns: 0, uniqueTools: 0 });
    }

    await dbConnect();

    const sp       = req.nextUrl.searchParams;
    const limit    = Math.min(Number(sp.get("limit")) || 25, 100);
    const moduleId = sp.get("moduleId")?.trim();
    const full     = sp.get("full") === "1";

    const query: Record<string, unknown> = { userId };
    if (moduleId) query.moduleId = moduleId;

    // Result payloads are large — only ship them when asked.
    const projection = full ? {} : { result: 0 };

    const [items, totalRuns, distinct] = await Promise.all([
      ToolUsage.find(query, projection).sort({ runAt: -1 }).limit(limit).lean(),
      ToolUsage.countDocuments({ userId }),
      ToolUsage.distinct("moduleId", { userId }),
    ]);

    return NextResponse.json({
      data: items,
      totalRuns,
      uniqueTools: distinct.length,
    });
  } catch {
    return NextResponse.json({ message: "Could not load tool history." }, { status: 500 });
  }
}
