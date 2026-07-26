"use client";

import { useEffect } from "react";

/**
 * Transparently refreshes an expired access token.
 *
 * Wraps window.fetch once. On a 401 from a same-origin /api call, it calls
 * /api/auth/refresh (which rotates the refresh-token JTI and detects reuse) and
 * replays the original request. Without this, /api/auth/refresh existed but was
 * unreachable, forcing long-lived access tokens.
 */
export default function AuthRefreshProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Guard against double-install under React strict mode / fast refresh.
    if ((window as any).__lamidFetchPatched) return;
    (window as any).__lamidFetchPatched = true;

    const original = window.fetch.bind(window);

    /** Concurrent 401s share one refresh instead of stampeding the endpoint. */
    let inflight: Promise<boolean> | null = null;

    const refresh = (): Promise<boolean> => {
      if (!inflight) {
        inflight = original("/api/auth/refresh", { method: "POST", credentials: "include" })
          .then((r) => r.ok)
          .catch(() => false)
          .finally(() => { inflight = null; });
      }
      return inflight;
    };

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const res = await original(input, init);
      if (res.status !== 401) return res;

      const url = typeof input === "string" ? input
        : input instanceof URL ? input.href
        : (input as Request).url;

      // Only same-origin API calls, and never the auth endpoints themselves —
      // refreshing in response to a failed login would loop.
      const isApi = url.startsWith("/api/") || url.startsWith(window.location.origin + "/api/");
      const isAuthRoute = /\/api\/auth\/(login|refresh|register|logout)/.test(url);
      if (!isApi || isAuthRoute) return res;

      const ok = await refresh();
      if (!ok) return res;                       // refresh failed — surface the original 401

      return original(input, init);              // replay once
    };

    return () => {
      window.fetch = original;
      (window as any).__lamidFetchPatched = false;
    };
  }, []);

  return <>{children}</>;
}
