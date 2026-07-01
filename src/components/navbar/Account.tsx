"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface AccountMenuProps {
  align?: "left" | "right";
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  return `${local[0]}${"*".repeat(Math.min(local.length - 1, 4))}@${domain}`;
}

function roleLabel(role: string) {
  if (role === "seller") return "Consultant";
  if (role === "admin")  return "Admin";
  return "Client";
}

function Initials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-[11px] font-bold text-white">
      {initials}
    </span>
  );
}

const AccountMenu: React.FC<AccountMenuProps> = ({ align = "right" }) => {
  const { user, loading, dashboardHref, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Close on outside click / Escape */
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  /* ── Loading ──────────────────────────────────────────────────── */
  if (loading) {
    return <div className="h-9 w-24 animate-pulse rounded-lg bg-white/10" />;
  }

  const dropdownClass = `absolute ${align === "right" ? "right-0" : "left-0"} mt-2 z-50`;

  /* ── Signed in ────────────────────────────────────────────────── */
  if (user) {
    return (
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          title={user.name}
          aria-label="Account menu"
          className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-red-600/50 hover:bg-white/10 focus:outline-none"
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <Initials name={user.name} />
          )}
        </button>

        {open && (
          <div className={`${dropdownClass} w-56 overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] shadow-[0_16px_48px_rgba(0,0,0,0.12)] dark:shadow-2xl`}>
            {/* User header */}
            <div className="border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] px-4 py-3">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-500">{maskEmail(user.email)}</p>
              <span className="mt-1.5 inline-block rounded-full bg-red-600/15 dark:bg-red-600/20 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400">
                {roleLabel(user.role)}
              </span>
            </div>

            {/* Nav links */}
            <ul className="py-1">
              {(user.role === "seller"
                ? [
                    { label: "Overview",         href: `${dashboardHref}?tab=overview` },
                    { label: "My Projects",      href: `${dashboardHref}?tab=projects` },
                    { label: "Messaging",        href: `${dashboardHref}?tab=messaging` },
                    { label: "Project Matching", href: `${dashboardHref}?tab=project-matching` },
                    { label: "Escrow",           href: `${dashboardHref}?tab=escrow` },
                    { label: "Settings",         href: `${dashboardHref}?tab=settings` },
                  ]
                : [
                    { label: "Overview",     href: `${dashboardHref}?tab=overview` },
                    { label: "My Projects",  href: `${dashboardHref}?tab=projects` },
                    { label: "Messaging",    href: `${dashboardHref}?tab=messaging` },
                    { label: "Escrow",       href: `${dashboardHref}?tab=escrow` },
                    { label: "Teams",        href: `${dashboardHref}?tab=teams` },
                    { label: "Settings",     href: `${dashboardHref}?tab=settings` },
                  ]
              ).map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 transition hover:bg-[#C12129]/8 hover:text-[#C12129] dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Sign out */}
            <div className="border-t border-gray-100 dark:border-white/10 py-1">
              <button
                onClick={() => { setOpen(false); signOut(); }}
                className="w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 transition hover:bg-red-600/8 dark:hover:bg-red-600/10 hover:text-red-700 dark:hover:text-red-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── Signed out ───────────────────────────────────────────────── */
  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition hover:border-red-600/50 hover:bg-white/10 hover:text-white focus:outline-none"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none" stroke="currentColor" strokeWidth="2"
        >
          <circle cx="12" cy="7" r="4" />
          <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" />
        </svg>
      </button>

      {open && (
        <div className={`${dropdownClass} w-48 overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] shadow-[0_16px_48px_rgba(0,0,0,0.12)] dark:shadow-xl`}>
          <ul className="py-1">
            {[
              { label: "Sign In", href: "/signin" },
              { label: "Sign Up", href: "/signup" },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 transition hover:bg-[#C12129]/8 hover:text-[#C12129] dark:hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
