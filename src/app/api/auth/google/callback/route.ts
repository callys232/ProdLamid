import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Users } from "@/lib/models/User";
import { Profile } from "@/lib/models/Profile";
import jwt from "jsonwebtoken";
import { awardPoints, SIGNUP_BONUS } from "@/lib/services/pointsService";

const JWT_SECRET   = process.env.JWT_SECRET   ?? "default_secret_key_change_me";
const CLIENT_ID    = process.env.GOOGLE_CLIENT_ID     ?? "";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "";

export async function GET(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";
  const code = new URL(req.url).searchParams.get("code");

  if (!code) return NextResponse.redirect(`${base}/signin?error=oauth_denied`);

  try {
    const callbackUrl = process.env.GOOGLE_CALLBACK_URL ?? `${base}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id:     CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri:  callbackUrl,
        grant_type:    "authorization_code",
      }),
    });
    const tokens = await tokenRes.json();
    if (!tokenRes.ok) throw new Error(tokens.error_description ?? "Token exchange failed");

    // Fetch Google profile
    const profileRes  = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const gProfile = await profileRes.json();
    const email    = gProfile.email as string;
    const googleId = gProfile.sub  as string;

    if (!email) throw new Error("No email returned from Google");

    await connectDB();

    let user = await Users.findOne({ $or: [{ googleId }, { email }] }) as any;
    let isNew = false;

    if (!user) {
      // New user — create with default client role
      const username = (gProfile.name ?? email.split("@")[0])
        .replace(/\s+/g, "").toLowerCase() + Math.floor(Math.random() * 1000);

      user  = await Users.create({ googleId, email, username, role: "client", isVerified: true });
      isNew = true;

      await Profile.create({
        user:       user._id,
        firstName:  gProfile.given_name  ?? "",
        lastName:   gProfile.family_name ?? "",
        profilePicture: gProfile.picture ?? "",
      });

      // Signup bonus points
      awardPoints(String(user._id), SIGNUP_BONUS.client, "Welcome bonus — Google signup", "google_signup").catch(console.error);
    } else if (!user.googleId) {
      // Existing email account — link Google ID
      user.googleId = googleId;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, ...(user.orgId && { orgId: String(user.orgId), orgRole: user.orgRole }) },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const redirect = isNew ? (user.role === "seller" ? "/profile" : "/client") : "/client";
    const response = NextResponse.redirect(`${base}${redirect}`);
    response.cookies.set("token", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      maxAge:   7 * 24 * 60 * 60,
      path:     "/",
    });
    return response;
  } catch (e: any) {
    console.error("Google OAuth error:", e.message);
    return NextResponse.redirect(`${base}/signin?error=oauth_failed`);
  }
}
