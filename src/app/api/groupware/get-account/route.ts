import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Users } from "@/lib/models/User";

export const dynamic = "force-dynamic";

// GET /api/groupware/get-account
// Used by dashboard.tsx to resolve which dashboard to redirect to after login.
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const user = await Users.findById(auth.userId).select("role orgId orgRole").lean() as any;
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    const accountType =
      user.orgId                   ? "Enterprise"  :
      user.role === "seller"        ? "Freelancer"  :
      user.role === "client"        ? "Client"      :
      user.role === "admin"         ? "Admin"       : "Client";

    return NextResponse.json({ success: true, accountType, role: user.role, orgId: user.orgId ?? null });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
