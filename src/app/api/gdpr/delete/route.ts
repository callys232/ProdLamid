import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Users } from "@/lib/models/User";
import { Profile } from "@/lib/models/Profile";
import { Bid } from "@/lib/models/Bid";
import { Notification } from "@/lib/models/Notification";
import { Wallet } from "@/lib/models/Wallet";
import { Points } from "@/lib/models/Points";
import { OrgMember } from "@/lib/models/OrgMember";

// POST /api/gdpr/delete — right to erasure (soft-delete + PII scrub)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const userId = auth.userId;

    // Anonymise user record (retain _id for referential integrity with projects/bids)
    await Users.findByIdAndUpdate(userId, {
      $set: {
        email:           `deleted_${userId}@lamid.invalid`,
        username:        `deleted_${userId}`,
        password:        "",
        googleId:        null,
        phoneNumber:     null,
        verificationCode: null,
        resetToken:      null,
        twoFASecret:     null,
        accountDeleted:  true,
      },
    });

    // Wipe PII from profile
    await Profile.findOneAndUpdate(
      { user: userId },
      { $set: { firstName: "Deleted", lastName: "User", bio: "", profilePicture: "", skills: [] } }
    );

    // Remove org membership
    await OrgMember.deleteMany({ userId });

    // Delete notifications, bids, wallet, points
    await Promise.all([
      Notification.deleteMany({ user: userId }),
      Bid.deleteMany({ bidderId: userId }),
      Wallet.deleteMany({ user: userId }),
      Points.deleteMany({ userId }),
    ]);

    // Clear auth cookie
    const response = NextResponse.json({ success: true, message: "Your account and personal data have been deleted." });
    response.cookies.delete("token");
    return response;
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
