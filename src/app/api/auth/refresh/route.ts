/**
 * POST /api/auth/refresh
 * Rotates the refresh token and issues a new short-lived access token.
 *
 * Flow:
 *  1. Read refresh token from httpOnly cookie
 *  2. Verify it is valid and matches the JTI stored on the user
 *  3. Issue a new 15-min access token + new refresh token (rotation)
 *  4. Invalidate the old refresh token (store new JTI on user)
 */

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import { Users } from "@/lib/models/User";
import { revokeToken } from "@/lib/tokenBlocklist";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET          = process.env.JWT_SECRET!;
const ACCESS_TOKEN_TTL    = 15 * 60;        // 15 minutes
const REFRESH_TOKEN_TTL   = 7 * 24 * 3600; // 7 days

const COOKIE = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path:     "/",
};

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refresh_token")?.value;
    if (!refreshToken) {
      return NextResponse.json({ success: false, message: "No refresh token" }, { status: 401 });
    }

    // Verify refresh token signature + expiry
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, JWT_SECRET);
    } catch {
      return NextResponse.json({ success: false, message: "Invalid or expired refresh token" }, { status: 401 });
    }

    if (decoded.type !== "refresh") {
      return NextResponse.json({ success: false, message: "Invalid token type" }, { status: 401 });
    }

    await connectDB();
    const user = await Users.findById(decoded.sub).lean() as any;
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
    }

    // Verify JTI matches what's stored — detects refresh token reuse
    if (user.refreshTokenJTI !== decoded.jti) {
      // Possible token reuse attack — revoke everything
      await Users.findByIdAndUpdate(decoded.sub, { $set: { refreshTokenJTI: null } });
      return NextResponse.json({ success: false, message: "Refresh token reuse detected" }, { status: 401 });
    }

    // Revoke old refresh token in blocklist
    await revokeToken(refreshToken, decoded.exp);

    // Issue new access token (15 min)
    const accessToken = jwt.sign(
      {
        sub:     String(user._id),
        userId:  String(user._id),
        role:    user.role,
        type:    "access",
        ...(user.orgId   && { orgId:   String(user.orgId)   }),
        ...(user.orgRole && { orgRole: user.orgRole }),
      },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    // Issue new refresh token (rotate — new JTI)
    const newJti = uuidv4();
    const newRefreshToken = jwt.sign(
      { sub: String(user._id), jti: newJti, type: "refresh" },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_TTL }
    );

    // Store new JTI on user (invalidates all old refresh tokens)
    await Users.findByIdAndUpdate(user._id, { $set: { refreshTokenJTI: newJti } });

    const res = NextResponse.json({ success: true, message: "Token refreshed" });

    res.cookies.set("token",         accessToken,    { ...COOKIE, maxAge: ACCESS_TOKEN_TTL  });
    res.cookies.set("refresh_token", newRefreshToken,{ ...COOKIE, maxAge: REFRESH_TOKEN_TTL });

    return res;
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Token refresh failed" }, { status: 500 });
  }
}
