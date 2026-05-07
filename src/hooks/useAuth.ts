"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "client" | "seller" | "admin";
  accountType?: "Client" | "Freelancer" | "Enterprise" | "Concierge" | "Admin";
  orgId?: string;
  avatar?: string;
}

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
  return "/client";
}

export function useAuth(): UseAuthReturn {
  const [user,    setUser]    = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
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
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    setUser(null);
    router.push("/signin");
  }, [router]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    dashboardHref: user ? getDashboardHref(user) : "/signin",
    signOut,
  };
}
