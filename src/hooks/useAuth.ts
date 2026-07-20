"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS_GATE === "true";

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "client" | "seller" | "admin";
  accountType?: "Client" | "Freelancer" | "Enterprise" | "Concierge" | "Admin" | "Engine";
  isPremium?: boolean;
  subscriptionStatus?: string;
  orgId?: string;
  avatar?: string;
}

/* Fake admin user returned when NEXT_PUBLIC_DEV_BYPASS_GATE=true */
const DEV_USER: AuthUser = {
  id:                 "dev-admin-bypass",
  name:               "Dev Admin",
  username:           "devadmin",
  email:              "dev@lamid.one",
  role:               "admin",
  accountType:        "Admin",
  isPremium:          true,
  subscriptionStatus: "active",
};

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  dashboardHref: string;
  signOut: () => Promise<void>;
}

function buildUser(raw: any): AuthUser {
  const profile = raw?.profile ?? {};
  const firstName = profile.firstName ?? "";
  const lastName  = profile.lastName  ?? "";
  const fullName  = `${firstName} ${lastName}`.trim();

  return {
    id:          raw._id ?? raw.id ?? "",
    name:        fullName || raw.username || raw.email,
    username:    raw.username    ?? "",
    email:       raw.email       ?? "",
    role:        raw.role        ?? "client",
    accountType: raw.accountType ?? undefined,
    orgId:       raw.orgId       ?? undefined,
    avatar:      profile.profilePicture ?? undefined,
  };
}

function getDashboardHref(user: AuthUser): string {
  // accountType takes priority (set by groupware after login)
  if (user.accountType === "Admin"      || user.role === "admin")  return "/admin";
  if (user.accountType === "Freelancer" || user.role === "seller") return "/profile";
  if (user.accountType === "Enterprise" || user.orgId)             return "/enterprise";
  if (user.accountType === "Concierge")                            return "/concierge";
  if (user.accountType === "Engine")                               return "/engines";
  return "/client";
}

export function useAuth(): UseAuthReturn {
  /* All hooks called unconditionally — bypass only affects return value */
  const [user,    setUser]    = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(!DEV_BYPASS);
  const router = useRouter();

  useEffect(() => {
    if (DEV_BYPASS) return;
    let mounted = true;
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (mounted && data?.success) setUser(buildUser(data.data));
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const signOut = useCallback(async () => {
    if (DEV_BYPASS) return;
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    try { localStorage.removeItem("account_type"); localStorage.removeItem("user_display"); } catch {}
    setUser(null);
    router.push("/signin");
  }, [router]);

  if (DEV_BYPASS) {
    return {
      user:            DEV_USER,
      loading:         false,
      isAuthenticated: true,
      dashboardHref:   "/admin",
      signOut:         async () => {},
    };
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    dashboardHref: user ? getDashboardHref(user) : "/signin",
    signOut,
  };
}
