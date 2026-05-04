import { NextResponse } from "next/server";

type Body = {
    role?: string;
    sessionId?: string;
    ssoLogoutUrl?: string;
};

async function revokeRefreshToken(refreshToken: string | null) {
    // TODO: implement token revocation in DB or call identity provider
    // Example: mark token revoked in DB, call OAuth provider revoke endpoint, etc.
    if (!refreshToken) return;
    // await db.revokeToken(refreshToken);
    return;
}

export async function POST(request: Request) {
    try {
        const body: Body = await request.json().catch(() => ({}));
        const role = body.role ?? "client";
        const sessionId = body.sessionId ?? null;
        const ssoLogoutUrl = body.ssoLogoutUrl ?? null;

        // Read refresh token from cookie (server-side)
        const cookieHeader = request.headers.get("cookie") ?? "";
        const cookies = Object.fromEntries(cookieHeader.split(";").map(c => {
            const [k, ...v] = c.trim().split("=");
            return [k, decodeURIComponent(v.join("="))];
        }));
        const refreshToken = cookies["refresh_token"] ?? null;

        // Attempt server-side revocation (best-effort)
        try {
            await revokeRefreshToken(refreshToken);
            // Optionally revoke role/session specific entries:
            if (sessionId) {
                // await revokeSessionById(sessionId);
            }
            // Optionally revoke all sessions for role:
            // if (role) await revokeRoleSessions(role);
        } catch (revErr) {
            console.error("Failed to revoke refresh token:", revErr);
            // continue to clear cookies and return success to client (best-effort)
        }

        // Build response and clear cookies
        const res = NextResponse.json({ success: true, message: "Logged out successfully", role });

        // Clear common auth cookies (HttpOnly, Secure, SameSite)
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax" as const,
            expires: new Date(0),
        };

        // Use NextResponse.cookies.set to clear cookies
        res.cookies.set("refresh_token", "", cookieOptions);
        res.cookies.set("access_token", "", cookieOptions);
        res.cookies.set("token",         "", cookieOptions);
        res.cookies.set("user_role",     "", { ...cookieOptions, httpOnly: false });
        // If you use other cookies, clear them here:
        // res.cookies.set("session", "", cookieOptions);

        // If SSO logout URL is provided, include it in the response so client can redirect
        if (ssoLogoutUrl) {
            return NextResponse.json({ success: true, ssoLogoutUrl }, { status: 200 });
        }

        return res;
    } catch (error: any) {
        console.error("Logout handler error:", error);
        // Return 200 with ok:false if you prefer best-effort; here we return 500 with message
        return NextResponse.json({ success: false, message: error?.message ?? "Logout failed" }, { status: 500 });
    }
}
