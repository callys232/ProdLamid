import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { SsoCode } from "@/lib/models/SsoCode";
import { rateLimit } from "@/lib/rateLimit";
import { LMS_ORIGIN } from "@/lib/externalPlatforms";

const SHARED_SECRET = process.env.LAMID_SSO_SHARED_SECRET ?? "";

// Allowed origins — external apps that may call this endpoint
const ALLOWED_ORIGINS = [
  LMS_ORIGIN,
  process.env.DOCUSHARE_URL  ? new URL(process.env.DOCUSHARE_URL).origin  : "https://fileshare-six-phi.vercel.app",
];

export async function POST(req: NextRequest) {
  try {
    // Rate-limit by IP to prevent brute-force code guessing
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rl  = await rateLimit(`sso-validate:${ip}`, { windowMs: 60_000, max: 10 });
    if (!rl.allowed) {
      return NextResponse.json({ success: false, message: "Too many requests" }, { status: 429 });
    }

    // Optional: reject calls not coming from known app origins
    const origin = req.headers.get("origin") ?? "";
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { code, secret } = body as { code?: string; secret?: string };

    // Constant-time comparison prevents timing attacks on the shared secret
    if (!secret || !SHARED_SECRET || secret.length !== SHARED_SECRET.length) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }
    let match = true;
    for (let i = 0; i < SHARED_SECRET.length; i++) {
      if (secret.charCodeAt(i) !== SHARED_SECRET.charCodeAt(i)) match = false;
    }
    if (!match) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    if (!code) {
      return NextResponse.json({ success: false, message: "Code required" }, { status: 400 });
    }

    await connectDB();

    // Atomically find-and-mark-used in one DB operation — prevents replay even under concurrent requests
    const ssoCode = await SsoCode.findOneAndUpdate(
      { code, used: false },
      { $set: { used: true } },
      { new: false }
    ).lean() as any;

    if (!ssoCode) {
      return NextResponse.json({ success: false, message: "Invalid or expired code" }, { status: 401 });
    }

    return NextResponse.json({
      success:     true,
      userId:      ssoCode.userId,
      email:       ssoCode.email,
      name:        ssoCode.name,
      accountType: ssoCode.accountType,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
