
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Users } from "@/lib/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { rateLimit } from "@/lib/rateLimit";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

// ── Hardcoded demo accounts ─────────────────────────────────────────────────
// Active when NODE_ENV !== "production" OR DEMO_MODE=true.
// These never touch the database.
const DEMO_CREDENTIALS: Record<string, {
  password:           string;
  userId:             string;
  email:              string;
  username:           string;
  name:               string;
  role:               string;
  accountType:        string;
  tier:               string;
  isPremium:          boolean;
  subscriptionStatus: string;
  orgUserCount?:      number;
  orgRole?:           string;
}> = {
  "demo.freelancer@lamidone.com": {
    password:           "Demo@Freelancer1",
    userId:             "demo-freelancer-000000000001",
    email:              "demo.freelancer@lamidone.com",
    username:           "demo_freelancer",
    name:               "Freelancer Demo",
    role:               "seller",
    accountType:        "Freelancer",
    tier:               "premium",
    isPremium:          true,
    subscriptionStatus: "active",
  },
  "demo.client@lamidone.com": {
    password:           "Demo@Client1",
    userId:             "demo-client-000000000002",
    email:              "demo.client@lamidone.com",
    username:           "demo_client",
    name:               "Client Demo",
    role:               "client",
    accountType:        "Client",
    tier:               "premium",
    isPremium:          true,
    subscriptionStatus: "active",
  },
  "demo.enterprise@lamidone.com": {
    password:           "Demo@Enterprise1",
    userId:             "demo-enterprise-000000000003",
    email:              "demo.enterprise@lamidone.com",
    username:           "demo_enterprise",
    name:               "Enterprise Demo",
    role:               "client",
    accountType:        "Enterprise",
    tier:               "enterprise",
    isPremium:          true,
    subscriptionStatus: "active",
    orgUserCount:       30,
    orgRole:            "org_admin",
  },
  "demo.concierge@lamidone.com": {
    password:           "Demo@Concierge1",
    userId:             "demo-concierge-000000000004",
    email:              "demo.concierge@lamidone.com",
    username:           "demo_concierge",
    name:               "Concierge Demo",
    role:               "client",
    accountType:        "Concierge",
    tier:               "enterprise",
    isPremium:          true,
    subscriptionStatus: "active",
  },
  "demo.engine@lamidone.com": {
    password:           "Demo@Engine1",
    userId:             "demo-engine-000000000005",
    email:              "demo.engine@lamidone.com",
    username:           "demo_engine",
    name:               "Engine Demo",
    role:               "client",
    accountType:        "Engine",
    tier:               "free",
    isPremium:          false,
    subscriptionStatus: "inactive",
  },
};

// Demo accounts are a product feature — enabled everywhere unless explicitly turned off
const DEMO_ENABLED = process.env.DEMO_MODE !== "false";

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
        const rl = await rateLimit(`login:${ip}`, { windowMs: 15 * 60 * 1000, max: 10 });
        if (!rl.allowed) {
            return NextResponse.json(
                { success: false, message: "Too many login attempts. Try again in 15 minutes." },
                { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
            );
        }

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Missing email or password" },
                { status: 400 }
            );
        }

        // ── Demo account short-circuit ──────────────────────────────────────
        if (DEMO_ENABLED) {
            const demo = DEMO_CREDENTIALS[email.toLowerCase().trim()];
            if (demo) {
                if (password !== demo.password) {
                    return NextResponse.json(
                        { success: false, message: "Invalid credentials" },
                        { status: 401 }
                    );
                }

                const { password: _pw, ...payload } = demo;
                const token = jwt.sign({ ...payload, dev: true }, JWT_SECRET, { expiresIn: "2h" });

                const response = NextResponse.json(
                    { success: true, data: { user: payload, token } },
                    { status: 200 }
                );
                response.cookies.set("token", token, {
                    httpOnly: true,
                    secure:   process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge:   2 * 60 * 60,
                    path:     "/",
                });
                response.cookies.set("user_role", demo.role, {
                    httpOnly: false,
                    secure:   process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge:   2 * 60 * 60,
                    path:     "/",
                });
                return response;
            }
        }
        // ────────────────────────────────────────────────────────────────────

        await connectDB();

        // Find User
        const user = await Users.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Reject deleted or suspended accounts before checking password
        if ((user as any).isDeleted || (user as any).status === "deleted") {
            return NextResponse.json(
                { success: false, message: "This account has been removed. Contact support if this is an error." },
                { status: 403 }
            );
        }
        if ((user as any).status === "suspended") {
            return NextResponse.json(
                { success: false, message: "Your account is suspended. Contact support to appeal." },
                { status: 403 }
            );
        }

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Include accountType, orgId, orgRole in token for route-level gating without DB hits
        const tokenPayload: Record<string, unknown> = {
            userId:      user._id,
            role:        user.role,
            accountType: (user as any).accountType ?? "Client",
        };
        if ((user as any).orgId)   tokenPayload.orgId   = String((user as any).orgId);
        if ((user as any).orgRole) tokenPayload.orgRole = (user as any).orgRole;

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

        // Sanitise user object — never send password to client
        const safeUser = { ...((user as any).toObject?.() ?? user) };
        delete safeUser.password;
        delete safeUser.verificationCode;
        delete safeUser.resetToken;
        delete safeUser.twoFASecret;

        const response = NextResponse.json(
            { success: true, data: { user: safeUser, token } },
            { status: 200 }
        );

        // HttpOnly token cookie (secure, not readable by JS)
        response.cookies.set("token", token, {
            httpOnly: true,
            secure:   process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge:   7 * 24 * 60 * 60,
            path:     "/",
        });

        // Readable role cookie (non-httpOnly) so client UI can show correct nav without an extra API call
        response.cookies.set("user_role", (user as any).role ?? "client", {
            httpOnly: false,
            secure:   process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge:   7 * 24 * 60 * 60,
            path:     "/",
        });

        return response;

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
