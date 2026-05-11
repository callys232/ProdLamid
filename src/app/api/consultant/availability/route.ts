import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Profile } from "@/lib/models/Profile";
import { cache, CacheKeys, TTL } from "@/lib/cache";
import { z } from "zod";

const AvailabilitySchema = z.object({
  openToWork:         z.boolean(),
  availabilityStatus: z.enum(["available", "partially_available", "unavailable"]).optional(),
  hoursPerWeek:       z.number().int().min(0).max(80).optional(),
  availableFrom:      z.string().datetime().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const body   = await request.json();
    const parsed = AvailabilitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid input", errors: parsed.error.issues.map(i => i.message) },
        { status: 400 }
      );
    }

    const profile = await Profile.findOneAndUpdate(
      { user: auth.userId },
      { $set: parsed.data },
      { new: true, upsert: false }
    ).lean();

    if (!profile) return NextResponse.json({ success: false, message: "Profile not found" }, { status: 404 });

    // Invalidate cached profile
    await cache.del(CacheKeys.userProfile(auth.userId));

    return NextResponse.json({ success: true, data: { availability: parsed.data } });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
