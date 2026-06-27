import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Users } from "@/lib/models/User";
import { verifyAccessToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorised." }, { status: 401 });

    const payload = verifyAccessToken(token);
    if (!payload?.sub) return NextResponse.json({ message: "Invalid token." }, { status: 401 });

    const { reason } = await req.json();
    if (!reason?.trim()) return NextResponse.json({ message: "Reason is required." }, { status: 400 });

    const user = await Users.findById(payload.sub).select("email username name");
    if (!user) return NextResponse.json({ message: "User not found." }, { status: 404 });

    // Flag the account as deletion-requested (admin can review in dashboard)
    await Users.findByIdAndUpdate(payload.sub, {
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
