import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requireAuth, hasRole } from "@/lib/middleware/auth";
import { Users } from "@/lib/models/User";

// GET — fetch all deletion requests (admin only)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (!hasRole(auth.userRole, ["admin"])) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const requests = await Users.find(
      { "deletionRequest.requested": true },
      "name email username deletionRequest createdAt"
    ).sort({ "deletionRequest.requestedAt": -1 });
    return NextResponse.json({ requests });
  } catch {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

// PATCH — admin approves (soft-deletes) or rejects a request (admin only)
export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (!hasRole(auth.userRole, ["admin"])) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const { userId, action } = await req.json();
    if (!userId || !action) return NextResponse.json({ message: "userId and action required." }, { status: 400 });

    if (action === "approve") {
      await Users.findByIdAndUpdate(userId, {
        isDeleted: true,
        status: "deleted",
        "deletionRequest.status": "approved",
        "deletionRequest.resolvedAt": new Date(),
      });
    } else {
      await Users.findByIdAndUpdate(userId, {
        "deletionRequest.status": "rejected",
        "deletionRequest.resolvedAt": new Date(),
      });
    }

    return NextResponse.json({ message: `Request ${action === "approve" ? "approved — account deleted" : "rejected"}.` });
  } catch {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
