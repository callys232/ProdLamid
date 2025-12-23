// components/ReferralHelper.ts
"use client";

import type { AgentType } from "@/types/agentTypes";

interface ReferralResult {
  referred: boolean;
  agent: AgentType;
  message: string;
}

/**
 * Checks a user message and decides if it should be referred
 * back to onboarding or support. Returns referral info if applicable.
 */
export function checkReferral(msg: string): ReferralResult | null {
  const lower = msg.toLowerCase();

  if (
    lower.includes("start") ||
    lower.includes("overview") ||
    lower.includes("onboarding") ||
    lower.includes("which agent")
  ) {
    return {
      referred: true,
      agent: "onboarding",
      message:
        "ℹ️ That’s more of an onboarding question. Redirecting you back to the Onboarding Assistant for clarity.",
    };
  }

  if (
    lower.includes("help") ||
    lower.includes("issue") ||
    lower.includes("support") ||
    lower.includes("troubleshoot") ||
    lower.includes("bug")
  ) {
    return {
      referred: true,
      agent: "support",
      message:
        "🛠️ Sounds like you need troubleshooting. Let’s move you to the Support Agent.",
    };
  }

  return null;
}
