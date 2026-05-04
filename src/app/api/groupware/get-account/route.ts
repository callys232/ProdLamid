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

    const user = await Users.findById(auth.userId).select("role orgId orgRole accountDeleted").lean() as any;
    if (!user || user.accountDeleted) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    // Validate org exists if claimed
    let verifiedOrgId: string | null = null;
    if (user.orgId) {
      const { Organization } = await import("@/lib/models/Organization");
      const org = await Organization.findById(user.orgId).select("_id status").lean() as any;
      if (org && org.status !== "suspended") verifiedOrgId = String(org._id);
    }

    const accountType =
      verifiedOrgId               ? "Enterprise"  :
      user.role === "seller"      ? "Freelancer"  :
      user.role === "admin"       ? "Admin"        :
      user.role === "client"      ? "Client"       : "Client";

    return NextResponse.json({
      success:     true,
      accountType,
      role:        user.role,
      orgId:       verifiedOrgId,
      orgRole:     user.orgRole ?? null,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
