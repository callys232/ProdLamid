// ⚠️ DEV ONLY — zero database dependency, self-contained JWT
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "@/lib/jwt";

const JWT_SECRET = getJwtSecret();

/* Payloads match JwtAccessTokenPayload — sub + type:"access" are required for verifyAccessToken */
const DEV_ACCOUNTS: Record<string, object> = {
  client: {
    sub:                "dev-client-001",
    userId:             "dev-client-001",
    email:              "client@lamid.test",
    name:               "Test Client",
    username:           "client_test",
    role:               "client",
    type:               "access",
    accountType:        "Client",
    isPremium:          false,
    subscriptionStatus: "inactive",
    isVerified:         true,
    dashboard:          "/client",
    dev:                true,
  },
  freelancer: {
    sub:                "dev-freelancer-001",
    userId:             "dev-freelancer-001",
    email:              "freelancer@lamid.test",
    name:               "Test Freelancer",
    username:           "freelancer_test",
    role:               "seller",
    type:               "access",
    accountType:        "Freelancer",
    isPremium:          false,
    subscriptionStatus: "inactive",
    isVerified:         true,
    dashboard:          "/profile",
    dev:                true,
  },
  enterprise: {
    sub:                "dev-enterprise-001",
    userId:             "dev-enterprise-001",
    email:              "enterprise@lamid.test",
    name:               "Test Enterprise",
    username:           "enterprise_test",
    role:               "client",
    type:               "access",
    accountType:        "Enterprise",
    isPremium:          true,
    subscriptionStatus: "active",
    isVerified:         true,
    dashboard:          "/enterprise",
    dev:                true,
  },
  concierge: {
    sub:                "dev-concierge-001",
    userId:             "dev-concierge-001",
    email:              "concierge@lamid.test",
    name:               "Test Concierge",
    username:           "concierge_test",
    role:               "client",
    type:               "access",
    accountType:        "Concierge",
    isPremium:          true,
    subscriptionStatus: "active",
    isVerified:         true,
    dashboard:          "/concierge",
    dev:                true,
  },
  admin: {
    sub:                "dev-admin-001",
    userId:             "dev-admin-001",
    email:              "admin@lamid.test",
    name:               "Dev Admin",
    username:           "admin_test",
    role:               "admin",
    type:               "access",
    accountType:        "Admin",
    isPremium:          true,
    subscriptionStatus: "active",
    isVerified:         true,
    dashboard:          "/admin",
    dev:                true,
  },
};

export async function GET(req: NextRequest) {
  // Block unless DEV_LOGIN_ENABLED is explicitly set — works in all environments
  if (process.env.DEV_LOGIN_ENABLED !== "true") {
    return NextResponse.json({ error: "Dev login is not enabled." }, { status: 403 });
  }

  const role   = req.nextUrl.searchParams.get("role") ?? "";
  const acct   = DEV_ACCOUNTS[role] as any;

  if (!acct) {
    return NextResponse.json(
      { error: `Unknown role. Use: ${Object.keys(DEV_ACCOUNTS).join(", ")}` },
      { status: 400 }
    );
  }

  /* Sign a self-contained token — all user data lives in the payload */
  const token = jwt.sign(acct, JWT_SECRET, { expiresIn: "7d" });

  const response = NextResponse.redirect(new URL(acct.dashboard, req.url));

  const isSecure = process.env.NODE_ENV === "production";

  response.cookies.set("token", token, {
    httpOnly: true,
    secure:   isSecure,
    sameSite: "lax",
    maxAge:   7 * 24 * 60 * 60,
    path:     "/",
  });

  response.cookies.set("user_role", acct.role, {
    httpOnly: false,
    secure:   isSecure,
    sameSite: "lax",
    maxAge:   7 * 24 * 60 * 60,
    path:     "/",
  });

  return response;
}
