import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Users } from "@/lib/models/User";
import { Profile } from "@/lib/models/Profile";
import { Project } from "@/lib/models/Project";
import { Bid } from "@/lib/models/Bid";
import { Message } from "@/lib/models/Message";
import { Notification } from "@/lib/models/Notification";
import { Wallet } from "@/lib/models/Wallet";
import { Points } from "@/lib/models/Points";

export const dynamic = "force-dynamic";

// GET /api/gdpr/export — returns all personal data for the authenticated user
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const userId = auth.userId;

    const [user, profile, projects, bids, notifications, wallet, points] = await Promise.all([
      Users.findById(userId).select("-password -verificationCode -resetToken -twoFASecret").lean(),
      Profile.findOne({ user: userId }).lean(),
      Project.find({ $or: [{ ownerId: userId }, { consultants: userId }] }).lean(),
      Bid.find({ bidderId: userId }).lean(),
      Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(200).lean(),
      Wallet.findOne({ user: userId }).lean(),
      Points.findOne({ userId }).lean(),
    ]);

    const exportData = {
      exportedAt:    new Date().toISOString(),
      account:       user,
      profile,
      projects:      { posted: projects.filter((p: any) => String(p.ownerId) === userId), involved: projects.filter((p: any) => String(p.ownerId) !== userId) },
      bids,
      notifications,
      wallet:        wallet ? { balance: (wallet as any).balance, transactions: (wallet as any).transactions?.slice(0, 100) } : null,
      points:        points ? { balance: (points as any).balance, transactions: (points as any).transactions?.slice(0, 100) } : null,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type":        "application/json",
        "Content-Disposition": `attachment; filename="lamid-data-export-${userId}.json"`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
