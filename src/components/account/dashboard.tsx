"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ROLE_DESTINATIONS: Record<string, string> = {
  Freelancer: "/profile",
  Client:     "/client",
  Enterprise: "/enterprise",
  Admin:      "/admin",
};

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    async function resolveDestination() {
      try {
        const res = await fetch("/api/groupware/get-account");

        if (res.status === 401) { router.replace("/signin"); return; }
        if (!res.ok) throw new Error("Account lookup failed");

        const { accountType } = await res.json();
        const dest = ROLE_DESTINATIONS[accountType];
        router.replace(dest ?? "/signin");
      } catch {
        router.replace("/signin");
      }
    }
    resolveDestination();
  }, [router]);

  return (
    <section className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c12129] border-t-transparent" />
        <p className="text-sm text-gray-500">Redirecting to your dashboard…</p>
      </div>
    </section>
  );
}
