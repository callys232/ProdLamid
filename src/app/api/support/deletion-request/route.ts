import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Users } from "@/lib/models/User";
import { verifyAuth } from "@/lib/middleware/auth";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    /* verifyAuth accepts both token shapes in circulation; verifyAccessToken
       required a `type:"access"` claim that /api/auth/login never emits, so
       this route rejected every real session. */
    const auth = await verifyAuth(req);
    if (!auth?.userId) return NextResponse.json({ message: "Unauthorised." }, { status: 401 });

    const { reason } = await req.json();
    if (!reason?.trim()) return NextResponse.json({ message: "Reason is required." }, { status: 400 });

    const user = await Users.findById(auth.userId).select("email username name");
    if (!user) return NextResponse.json({ message: "User not found." }, { status: 404 });

    // Flag the account as deletion-requested (admin can review in dashboard)
    await Users.findByIdAndUpdate(auth.userId, {
      "deletionRequest": {
        requested: true,
        reason: reason.trim(),
        requestedAt: new Date(),
        status: "pending",
      },
    });

    // TODO: send notification email to admin
    // await sendEmail({
    //   to: "hq@lamidconsulting.com",
    //   subject: `Account Deletion Request — ${user.email}`,
    //   text: `User ${user.username || user.name} (${user.email}) has requested account deletion.\n\nReason: ${reason}`,
    // });

    return NextResponse.json({ message: "Deletion request submitted." });
  } catch (error) {
    console.error("Deletion request error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
