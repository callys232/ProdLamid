import { Users } from "@/lib/models/User";

export type UserTier = "free" | "premium" | "enterprise" | "enterprise_plus" | "admin";

// Features and which tiers can access them
const TIER_FEATURES: Record<string, UserTier[]> = {
  ai_matching:          ["premium", "enterprise", "enterprise_plus", "admin"],
  ai_project_match:     ["premium", "enterprise", "enterprise_plus", "admin"],
  advanced_analytics:   ["premium", "enterprise", "enterprise_plus", "admin"],
  unlimited_projects:   ["premium", "enterprise", "enterprise_plus", "admin"],
  priority_support:     ["premium", "enterprise", "enterprise_plus", "admin"],
  ai_preferences:       ["premium", "enterprise", "enterprise_plus", "admin"],
  white_label:          ["enterprise_plus", "admin"],
  org_dashboard:        ["enterprise", "enterprise_plus", "admin"],
  dedicated_account:    ["enterprise", "enterprise_plus", "admin"],
};

// Tier hierarchy for comparisons
const TIER_RANK: Record<UserTier, number> = {
  free:            0,
  premium:         1,
  enterprise:      2,
  enterprise_plus: 3,
  admin:           99,
};

export async function getUserTier(userId: string): Promise<UserTier> {
  const user = await Users.findById(userId).select("role tier subscriptionStatus orgId").lean() as any;
  if (!user)              return "free";
  if (user.role === "admin") return "admin";

  // Enterprise: has an org
  if (user.orgId) {
    const { Organization } = await import("@/lib/models/Organization");
    const org = await Organization.findById(user.orgId).select("tier").lean() as any;
    return (org?.tier as UserTier) ?? "enterprise";
  }

  // Premium: subscription active
  if (user.tier === "premium" && user.subscriptionStatus === "active") return "premium";
  if (user.isPremium) return "premium"; // legacy flag

  return "free";
}

export function hasFeature(tier: UserTier, feature: string): boolean {
  const allowed = TIER_FEATURES[feature];
  if (!allowed) return true; // unlisted feature = unrestricted
  return allowed.includes(tier);
}

export function tierAtLeast(tier: UserTier, minimum: UserTier): boolean {
  return TIER_RANK[tier] >= TIER_RANK[minimum];
}

// Convenience: get tier then check feature in one call
export async function userHasFeature(userId: string, feature: string): Promise<boolean> {
  const tier = await getUserTier(userId);
  return hasFeature(tier, feature);
}
