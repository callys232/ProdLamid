import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Users } from "@/lib/models/User";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "@/lib/jwt";

export const dynamic = "force-dynamic";

const JWT_SECRET = getJwtSecret();
// Demo short-circuit enabled everywhere unless explicitly turned off
const DEMO_ENABLED = process.env.DEMO_MODE !== "false";

// GET /api/groupware/get-account
// Used by dashboard.tsx to resolve which dashboard to redirect to after login.
export async function GET(req: NextRequest) {
  try {
    // Dev/demo token short-circuit — no DB touch
    if (DEMO_ENABLED) {
      const raw = req.cookies.get("token")?.value;
      if (raw) {
        try {
          const decoded: any = jwt.verify(raw, JWT_SECRET);
          if (decoded?.dev === true) {
            return NextResponse.json({
              success:     true,
              accountType: decoded.accountType ?? "Client",
              role:        decoded.role        ?? "client",
              orgId:       null,
              orgRole:     null,
            });
          }
        } catch {}
      }
    }

    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const user = await Users.findById(auth.userId).select("role orgId orgRole accountDeleted accountType").lean() as any;
    if (!user || user.accountDeleted) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    // Validate org exists if claimed
    let verifiedOrgId: string | null = null;
    if (user.orgId) {
      const { Organization } = await import("@/lib/models/Organization");
      const org = await Organization.findById(user.orgId).select("_id status").lean() as any;
      if (org && org.status !== "suspended") verifiedOrgId = String(org._id);
    }

    // Enterprise if: org verified, OR has any orgId, OR accountType already set
    const isEnterprise = !!verifiedOrgId || !!user.orgId || user.accountType === "Enterprise";

    const accountType =
      isEnterprise                           ? "Enterprise"  :
      user.role === "admin"                  ? "Admin"       :
      user.role === "seller"                 ? "Freelancer"  :
      user.accountType === "Concierge"       ? "Concierge"   :
      user.accountType === "Engine"          ? "Engine"      :
                                               "Client";

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
