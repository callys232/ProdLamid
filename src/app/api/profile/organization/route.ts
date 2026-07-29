import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { OrganizationProfile } from "@/lib/models/OrganizationProfile";
import { verifyAuth } from "@/lib/middleware/auth";

export const dynamic = "force-dynamic";

/* Demo and dev sessions carry a signed token but no database record, and their
   ids are not ObjectIds — querying with one throws a CastError. They keep
   working entirely on the local copy. */
const isPersistableUser = (userId: string) => mongoose.Types.ObjectId.isValid(userId);

async function getUserId(req: NextRequest): Promise<string | null> {
  const auth = await verifyAuth(req);
  return auth?.userId ?? null;
}

/** The signed-in member's organisation profile. */
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthorised." }, { status: 401 });
    if (!isPersistableUser(userId)) return NextResponse.json({ data: null });

    await dbConnect();
    const doc = await OrganizationProfile.findOne({ userId }).lean();
    if (!doc) return NextResponse.json({ data: null });

    const d = doc as Record<string, unknown>;
    return NextResponse.json({
      data: {
        organisationName: d.organisationName ?? "",
        industry:         d.industry ?? "",
        size:             d.size ?? "",
        headcount:        d.headcount ?? null,
        currency:         d.currency ?? "USD",
        region:           d.region ?? "",
        periodLabel:      d.periodLabel ?? "Month",
        updatedAt:        d.updatedAt instanceof Date ? d.updatedAt.toISOString() : null,
      },
    });
  } catch {
    return NextResponse.json({ message: "Could not load the profile." }, { status: 500 });
  }
}

/**
 * Save the profile. Only fields actually supplied are written, so a tool that
 * collected three of the seven cannot blank the other four.
 */
export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthorised." }, { status: 401 });
    if (!isPersistableUser(userId)) {
      return NextResponse.json({ message: "Not stored for demo accounts." }, { status: 202 });
    }

    const body = await req.json();
    const str = (v: unknown, max: number) =>
      typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined;

    const headcountRaw = Number(body?.headcount);
    const headcount =
      Number.isFinite(headcountRaw) && headcountRaw >= 0 ? Math.floor(headcountRaw) : undefined;
    const period = body?.periodLabel;

    const update: Record<string, unknown> = {
      organisationName: str(body?.organisationName, 160),
      industry:         str(body?.industry, 120),
      size:             str(body?.size, 60),
      currency:         str(body?.currency, 8),
      region:           str(body?.region, 120),
      headcount,
      periodLabel: ["Month", "Quarter", "Week"].includes(period) ? period : undefined,
    };
    // Undefined keys would be written as nulls by $set, wiping stored values.
    for (const k of Object.keys(update)) if (update[k] === undefined) delete update[k];

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ message: "Nothing to update." }, { status: 202 });
    }

    await dbConnect();
    await OrganizationProfile.findOneAndUpdate(
      { userId },
      { $set: update, $setOnInsert: { userId } },
      { upsert: true, runValidators: true, new: true },
    );

    return NextResponse.json({ message: "Saved." });
  } catch {
    return NextResponse.json({ message: "Could not save the profile." }, { status: 500 });
  }
}
