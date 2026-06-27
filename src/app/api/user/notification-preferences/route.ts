import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Users } from "@/lib/models/User";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    const user = await Users.findById(auth.userId).select("notificationPrefs").lean() as any;
    return NextResponse.json({ success: true, data: user?.notificationPrefs ?? { emailNotifications: true, projectUpdates: true, messages: true, billing: true } });
  } catch (e: any) { return NextResponse.json({ success: false, message: e.message }, { status: 500 }); }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    const prefs = await req.json();
    await Users.findByIdAndUpdate(auth.userId, { $set: { notificationPrefs: prefs } });
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ success: false, message: e.message }, { status: 500 }); }
}
