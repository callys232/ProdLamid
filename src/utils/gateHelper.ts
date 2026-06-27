// smartGate.ts
export type UserPlan = "free" | "premium" | "enterprise";

export type GateMode = "full" | "preview";

export interface UserContext {
    id?: string;
    plan: UserPlan;

}

export interface GateResult {
    allowed: boolean;
    mode: GateMode;
}

export function evaluateGate(user: UserContext): GateResult {
    const isPremium =
        user.plan === "premium" || user.plan === "enterprise";

    return {
        allowed: isPremium,
        mode: isPremium ? "full" : "preview",
    };
}