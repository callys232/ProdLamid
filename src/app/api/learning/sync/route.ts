import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { LearningRecord } from "@/lib/models/LearningRecord";
import { Profile } from "@/lib/models/Profile";
import { LMS_ORIGIN } from "@/lib/externalPlatforms";

export const dynamic = "force-dynamic";

/**
 * Learning completions pushed in from the LMS.
 *
 * The LMS already receives this ecosystem's `userId` during SSO, so it can
 * report against it. Records land in LearningRecord and enrich the user's
 * profile skills, which is what makes career path readiness, succession and
 * capability analysis run on real learning rather than on what someone
 * remembered to type.
 *
 * Authenticated with the same shared secret as the SSO exchange, compared in
 * constant time. This endpoint writes to user profiles, so an attacker who
 * could call it could fabricate qualifications.
 */

const SHARED_SECRET = process.env.LAMID_SSO_SHARED_SECRET ?? "";
const MAX_BATCH = 200;

/** Timing-safe secret check that does not leak length through early return. */
function secretOk(provided: string | undefined): boolean {
  if (!SHARED_SECRET || !provided) return false;
  const a = crypto.createHash("sha256").update(provided).digest();
  const b = crypto.createHash("sha256").update(SHARED_SECRET).digest();
  return crypto.timingSafeEqual(a, b);
}

interface IncomingRecord {
  externalId?:  string;
  title?:       string;
  provider?:    string;
  skills?:      unknown;
  hours?:       unknown;
  certified?:   unknown;
  credentialUrl?: string;
  progressPct?: unknown;
  status?:      string;
  startedAt?:   string;
  completedAt?: string;
}

const cleanSkills = (v: unknown): string[] =>
  Array.isArray(v)
    ? [...new Set(v.filter((s): s is string => typeof s === "string" && s.trim().length > 0)
        .map((s) => s.trim()).slice(0, 30))]
    : [];

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rl = await rateLimit(`learning-sync:${ip}`, { windowMs: 60_000, max: 60 });
    if (!rl.allowed) {
      return NextResponse.json({ success: false, message: "Too many requests" }, { status: 429 });
    }

    // Reject calls from anywhere other than the platforms we federate with.
    const origin = req.headers.get("origin") ?? "";
    if (origin && origin !== LMS_ORIGIN) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { secret, userId, records } = body as {
      secret?: string; userId?: string; records?: IncomingRecord[];
    };

    if (!secretOk(secret)) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, message: "A valid userId is required" }, { status: 400 });
    }
    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ success: false, message: "records must be a non-empty array" }, { status: 400 });
    }
    if (records.length > MAX_BATCH) {
      return NextResponse.json(
        { success: false, message: `At most ${MAX_BATCH} records per call` },
        { status: 413 },
      );
    }

    await connectDB();

    const skipped: string[] = [];
    const ops = records.flatMap((r) => {
      // A record with no stable id cannot be made idempotent, so it is refused.
      if (!r.externalId?.trim() || !r.title?.trim()) {
        skipped.push(r.title ?? r.externalId ?? "unnamed record");
        return [];
      }
      const hours = Number(r.hours);
      const pct   = Number(r.progressPct);
      return [{
        updateOne: {
          filter: { userId, source: "lms", externalId: r.externalId.trim() },
          update: {
            $set: {
              title:       r.title.trim(),
              provider:    r.provider?.trim(),
              skills:      cleanSkills(r.skills),
              hours:       Number.isFinite(hours) && hours >= 0 ? hours : 0,
              certified:   Boolean(r.certified),
              credentialUrl: r.credentialUrl,
              progressPct: Number.isFinite(pct) ? Math.max(0, Math.min(100, pct)) : 100,
              status:      ["in_progress", "completed", "expired"].includes(r.status ?? "")
                ? r.status : "completed",
              startedAt:   r.startedAt   ? new Date(r.startedAt)   : undefined,
              completedAt: r.completedAt ? new Date(r.completedAt) : undefined,
              syncedAt:    new Date(),
            },
          },
          upsert: true,
        },
      }];
    });

    if (ops.length === 0) {
      return NextResponse.json(
        { success: false, message: "No record carried both an externalId and a title.", skipped },
        { status: 400 },
      );
    }

    const res = await LearningRecord.bulkWrite(ops, { ordered: false });

    /* Push the skills onto the profile too. $addToSet means re-syncing the same
       course never duplicates a skill, and skills the user added by hand are
       left alone. Only completed learning counts — an in-progress course is not
       yet evidence of anything. */
    const earned = [...new Set(
      records
        .filter((r) => (r.status ?? "completed") === "completed")
        .flatMap((r) => cleanSkills(r.skills)),
    )];
    if (earned.length > 0) {
      await Profile.updateOne({ user: userId }, { $addToSet: { skills: { $each: earned } } });
    }

    return NextResponse.json({
      success:  true,
      upserted: res.upsertedCount ?? 0,
      updated:  res.modifiedCount ?? 0,
      skillsAdded: earned.length,
      ...(skipped.length ? { skipped } : {}),
    });
  } catch (e: unknown) {
    console.error("[Learning/sync]", e);
    return NextResponse.json({ success: false, message: "Sync failed." }, { status: 500 });
  }
}
