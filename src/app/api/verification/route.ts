import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Profile from "@/lib/models/Profile";

// GET — fetch verification status for a user
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ message: "userId required." }, { status: 400 });

    const profile = await Profile.findOne({ user: userId }).select("verification");
    return NextResponse.json({ verification: profile?.verification ?? { status: "unsubmitted" } });
  } catch (error) {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

// PATCH — admin updates verification status
export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { userId, status, notes } = await req.json();

    if (!userId || !status) return NextResponse.json({ message: "userId and status required." }, { status: 400 });
    if (!["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ message: "Invalid status." }, { status: 400 });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      {
        "verification.status": status,
        "verification.reviewedAt": new Date(),
        "verification.notes": notes || "",
        ...(status === "approved" ? { "verification.verifiedAt": new Date() } : {}),
      },
      { new: true }
    );

    if (!profile) return NextResponse.json({ message: "Profile not found." }, { status: 404 });
    return NextResponse.json({ verification: profile.verification });
  } catch (error) {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
