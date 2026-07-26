import { NextRequest, NextResponse } from "next/server";
import { revokeToken } from "@/lib/tokenBlocklist";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "@/lib/jwt";

const JWT_SECRET = getJwtSecret();

const COOKIE_CLEAR = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path:     "/",
  expires:  new Date(0),
};

export async function POST(request: NextRequest) {
  try {
    // Extract and revoke the current token from the cookie
    const token = request.cookies.get("token")?.value;

    if (token) {
      try {
        // Decode without verifying (we still want to revoke even if nearly expired)
        const decoded = jwt.decode(token) as { exp?: number } | null;
        const expSeconds = decoded?.exp ?? Math.floor(Date.now() / 1000) + 7 * 86400;
        await revokeToken(token, expSeconds);
      } catch {
        // Malformed token — safe to ignore, just clear the cookie
      }
    }

    // Also handle any SSO logout redirect
    const body = await request.json().catch(() => ({}));
    const ssoLogoutUrl = body?.ssoLogoutUrl ?? null;

    const res = NextResponse.json({ success: true, message: "Logged out successfully" });

    // Clear all auth cookies
    res.cookies.set("token",         "", COOKIE_CLEAR);
    res.cookies.set("access_token",  "", COOKIE_CLEAR);
    res.cookies.set("refresh_token", "", COOKIE_CLEAR);
    res.cookies.set("user_role",     "", { ...COOKIE_CLEAR, httpOnly: false });

    if (ssoLogoutUrl) {
      return NextResponse.json({ success: true, ssoLogoutUrl });
    }

    return res;
  } catch (error: any) {
    console.error("[logout]", error);
    return NextResponse.json({ success: false, message: "Logout failed" }, { status: 500 });
  }
}
