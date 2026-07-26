"use client";

import Link from "next/link";

const ACCOUNTS = [
  {
    role:       "client",
    label:      "Client",
    email:      "client@lamid.test",
    password:   "Client@123",
    dashboard:  "/client",
    btnClass:   "bg-blue-500/10 text-blue-400 border border-blue-500/25",
    icon:       "👤",
    desc:       "Projects, invoices, and hiring tools",
  },
  {
    role:       "freelancer",
    label:      "Freelancer / Consultant",
    email:      "freelancer@lamid.test",
    password:   "Freelancer@123",
    dashboard:  "/profile",
    btnClass:   "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25",
    icon:       "💼",
    desc:       "Expert profile, bids, and earnings",
  },
  {
    role:       "enterprise",
    label:      "Enterprise",
    email:      "enterprise@lamid.test",
    password:   "Enterprise@123",
    dashboard:  "/enterprise",
    btnClass:   "bg-violet-500/10 text-violet-400 border border-violet-500/25",
    icon:       "🏢",
    desc:       "Team management and org billing",
  },
  {
    role:       "concierge",
    label:      "Concierge",
    email:      "concierge@lamid.test",
    password:   "Concierge@123",
    dashboard:  "/concierge",
    btnClass:   "bg-amber-500/10 text-amber-400 border border-amber-500/25",
    icon:       "🎩",
    desc:       "Managed service and PM console",
  },
  {
    role:       "admin",
    label:      "Admin",
    email:      "admin@lamid.test",
    password:   "Admin@123",
    dashboard:  "/admin",
    btnClass:   "bg-blue-500/10 text-blue-400 border border-blue-500/25",
    icon:       "🛡️",
    desc:       "Full platform admin console",
  },
];

export default function DevLoginPage() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-bold tracking-widest bg-amber-500/15 text-amber-400 border border-amber-500/25">
            DEV MODE — NOT FOR PRODUCTION
          </span>
          <h1 className="text-2xl font-bold text-white mb-2">Test Account Login</h1>
          <p className="text-sm text-white/40">
            One click to log in as any account type. Each button creates the account
            (if it doesn&apos;t exist) and sets your auth session instantly.
          </p>
        </div>

        {/* Account cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {ACCOUNTS.map((acct) => (
            <a
              key={acct.role}
              href={`/api/dev/auto-login?role=${acct.role}`}
              className="group flex flex-col gap-2 p-5 rounded-2xl border border-white/8 bg-white/4 hover:bg-white/8 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{acct.icon}</span>
                <div>
                  <p className="font-semibold text-white text-sm leading-tight">{acct.label}</p>
                  <p className="text-[10px] text-white/35 mt-0.5">{acct.desc}</p>
                </div>
              </div>

              <div className="mt-1 rounded-xl p-3 bg-black/30 font-mono text-[10px] text-white/40 space-y-0.5">
                <div><span className="text-white/20">email</span>    {acct.email}</div>
                <div><span className="text-white/20">pass </span>    {acct.password}</div>
                <div><span className="text-white/20">goes to</span>  {acct.dashboard}</div>
              </div>

              <div className={`mt-1 w-full py-2 rounded-xl text-xs font-bold text-center transition-opacity group-hover:opacity-100 opacity-80 ${acct.btnClass}`}>
                Login as {acct.label} →
              </div>
            </a>
          ))}
        </div>

        {/* Quick access links */}
        <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Quick Access After Login</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "CORE Dashboard",  href: "/core-dashboard"    },
              { label: "GROW Dashboard",  href: "/grow-dashboard"    },
              { label: "TALENT Dashboard",href: "/talent-dashboard"  },
              { label: "Intelligence Hub",href: "/intelligence-hub"  },
              { label: "Operating Model",       href: "/operating-model"         },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/50 hover:text-white hover:border-white/25 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <p className="text-center text-[10px] text-white/20 mt-6">
          This page is only visible in development. It does not exist in production builds.
        </p>
      </div>
    </main>
  );
}
