import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Users as User } from "@/lib/models/User";

// POST — submit a concierge tier request (requires admin approval)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, email, organisation, orgType, description, userId } = await req.json();

    if (!name || !email || !organisation) {
      return NextResponse.json({ message: "Name, email, and organisation are required." }, { status: 400 });
    }

    // If user is logged in, attach the request to their account
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        "conciergeRequest": {
          status: "pending",
          submittedAt: new Date(),
          organisation,
          orgType: orgType || "Other",
          description: description || "",
        },
      });
    }

    // TODO: send notification email to admin
    // await sendEmail({ to: "hq@lamidconsulting.com", subject: `New Concierge Request — ${organisation}`, ... });

    return NextResponse.json({
      message: "Your Concierge request has been submitted. Our team will review and contact you within 24 hours.",
      status: "pending",
    });
  } catch (error) {
    console.error("Concierge request error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

// GET — admin fetch all pending concierge requests
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const users = await User.find(
      { "conciergeRequest.status": { $exists: true } },
      "name email conciergeRequest createdAt"
    ).sort({ "conciergeRequest.submittedAt": -1 });

    return NextResponse.json({ requests: users });
  } catch (error) {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

// PATCH — admin approves or rejects a concierge request
export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { userId, action, notes } = await req.json(); // action: "approve" | "reject"

    if (!userId || !action) {
      return NextResponse.json({ message: "userId and action required." }, { status: 400 });
    }

    const status = action === "approve" ? "approved" : "rejected";

    await User.findByIdAndUpdate(userId, {
      "conciergeRequest.status": status,
      "conciergeRequest.reviewedAt": new Date(),
      "conciergeRequest.notes": notes || "",
      ...(status === "approved" ? { accountType: "Concierge" } : {}),
    });

    // TODO: send approval/rejection email to user

    return NextResponse.json({ message: `Request ${status} successfully.` });
  } catch (error) {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
