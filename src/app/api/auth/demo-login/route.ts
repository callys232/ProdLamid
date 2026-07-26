import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "@/lib/jwt";

const JWT_SECRET = getJwtSecret();

const DEMO_ACCOUNTS = {
  starter: {
    userId:             "demo-starter-000000000001",
    email:              "demo.starter@lamidone.com",
    username:           "demo_starter",
    name:               "Starter Demo",
    role:               "client",
    accountType:        "Client",
    tier:               "free",
    isPremium:          false,
    subscriptionStatus: "inactive",
  },
  growth: {
    userId:             "demo-growth-000000000002",
    email:              "demo.growth@lamidone.com",
    username:           "demo_growth",
    name:               "Growth Demo",
    role:               "client",
    accountType:        "Client",
    tier:               "premium",
    isPremium:          true,
    subscriptionStatus: "active",
  },
  enterprise: {
    userId:             "demo-enterprise-000000000003",
    email:              "demo.enterprise@lamidone.com",
    username:           "demo_enterprise",
    name:               "Enterprise Demo",
    role:               "client",
    accountType:        "Enterprise",
    tier:               "enterprise",
    isPremium:          true,
    subscriptionStatus: "active",
  },
} as const;

type DemoTier = keyof typeof DEMO_ACCOUNTS;

// Demo accounts are a product feature — enabled everywhere unless explicitly turned off
const DEMO_ENABLED = process.env.DEMO_MODE !== "false";

export async function GET(req: NextRequest) {
  if (!DEMO_ENABLED) {
    return NextResponse.json({ success: false, message: "Demo login is not available." }, { status: 403 });
  }

  const tier = req.nextUrl.searchParams.get("tier") as DemoTier | null;
  if (!tier || !DEMO_ACCOUNTS[tier]) {
    return NextResponse.json(
      { success: false, message: "Invalid tier. Valid options: starter, growth, enterprise." },
      { status: 400 }
    );
  }

  const account = DEMO_ACCOUNTS[tier];
  const token = jwt.sign({ ...account, dev: true }, JWT_SECRET, { expiresIn: "2h" });

  const destination =
    account.accountType === "Enterprise" ? "/enterprise" : "/client";

  const response = NextResponse.redirect(new URL(destination, req.url));
  response.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    path:     "/",
    maxAge:   2 * 60 * 60,
    secure:   process.env.NODE_ENV === "production",
  });

  return response;
}
