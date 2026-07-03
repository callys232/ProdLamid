// ⚠️ DEV ONLY — zero database dependency, self-contained JWT
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev_secret_key_lamid";

/* All user data is embedded directly in the token — no DB needed */
const DEV_ACCOUNTS: Record<string, object> = {
  client: {
    userId:             "dev-client-001",
    email:              "client@lamid.test",
    name:               "Test Client",
    username:           "client_test",
    role:               "client",
    accountType:        "Client",
    isPremium:          false,
    subscriptionStatus: "inactive",
    isVerified:         true,
    dashboard:          "/client",
    dev:                true,
  },
  freelancer: {
    userId:             "dev-freelancer-001",
    email:              "freelancer@lamid.test",
    name:               "Test Freelancer",
    username:           "freelancer_test",
    role:               "seller",
    accountType:        "Freelancer",
    isPremium:          false,
    subscriptionStatus: "inactive",
    isVerified:         true,
    dashboard:          "/profile",
    dev:                true,
  },
  enterprise: {
    userId:             "dev-enterprise-001",
    email:              "enterprise@lamid.test",
    name:               "Test Enterprise",
    username:           "enterprise_test",
    role:               "client",
    accountType:        "Enterprise",
    isPremium:          true,
    subscriptionStatus: "active",
    isVerified:         true,
    dashboard:          "/enterprise",
    dev:                true,
  },
  concierge: {
    userId:             "dev-concierge-001",
    email:              "concierge@lamid.test",
    name:               "Test Concierge",
    username:           "concierge_test",
    role:               "client",
    accountType:        "Concierge",
    isPremium:          true,
    subscriptionStatus: "active",
    isVerified:         true,
    dashboard:          "/concierge",
    dev:                true,
  },
  admin: {
    userId:             "dev-admin-001",
    email:              "admin@lamid.test",
    name:               "Dev Admin",
    username:           "admin_test",
    role:               "admin",
    accountType:        "Admin",
    isPremium:          true,
    subscriptionStatus: "active",
    isVerified:         true,
    dashboard:          "/admin",
    dev:                true,
  },
};

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production." }, { status: 403 });
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

  response.cookies.set("token", token, {
    httpOnly: true,
    secure:   false,
    sameSite: "lax",
    maxAge:   7 * 24 * 60 * 60,
    path:     "/",
  });

  response.cookies.set("user_role", acct.role, {
    httpOnly: false,
    secure:   false,
    sameSite: "lax",
    maxAge:   7 * 24 * 60 * 60,
    path:     "/",
  });

  return response;
}
