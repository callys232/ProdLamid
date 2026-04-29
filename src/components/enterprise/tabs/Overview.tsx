"use client";

import { motion } from "framer-motion";
import { FolderPlus, UserPlus, ArrowRight, Clock, CheckCircle, AlertCircle } from "lucide-react";
import type { EnterpriseDashboardStats, OrgTier } from "@/types/enterprise";

interface Props {
  stats: EnterpriseDashboardStats | null;
  tier: OrgTier;
  orgName: string;
  onTabChange: (tab: string) => void;
}

const MOCK_ACTIVITY = [
  { type: "project",  text: "New project posted: ERP System Integration",       time: "2h ago",  status: "open"      },
  { type: "member",   text: "Sarah O. accepted team invite",                     time: "5h ago",  status: "joined"    },
  { type: "milestone",text: "Milestone approved: Data Warehouse — Phase 1",      time: "1d ago",  status: "completed" },
  { type: "bid",      text: "3 new consultant bids on Marketing Strategy",       time: "1d ago",  status: "pending"   },
  { type: "payment",  text: "Escrow released: $22,000 — SaaS Dashboard Build",  time: "2d ago",  status: "paid"      },
];

const MOCK_CONSULTANTS = [
  { name: "Amara Nwosu",     cat: "Technology & Software",  projects: 4, rating: 4.9 },
  { name: "James Thornton",  cat: "Finance & Accounting",   projects: 3, rating: 4.8 },
  { name: "Priya Sharma",    cat: "Data & Analytics",       projects: 2, rating: 5.0 },
];

const STATUS_ICON: Record<string, React.ReactNode> = {
  open:      <AlertCircle className="h-3.5 w-3.5 text-blue-400" />,
  joined:    <CheckCircle className="h-3.5 w-3.5 text-green-400" />,
  completed: <CheckCircle className="h-3.5 w-3.5 text-green-400" />,
  pending:   <Clock       className="h-3.5 w-3.5 text-yellow-400" />,
  paid:      <CheckCircle className="h-3.5 w-3.5 text-[#c12129]" />,
};

const card = "rounded-xl border border-white/10 bg-white/5 p-5";

export default function Overview({ stats, tier, orgName, onTabChange }: Props) {
  return (
    <div className="space-y-6 p-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-[#c12129]/20 bg-[#c12129]/5 px-5 py-4"
      >
        <h2 className="text-base font-semibold text-white">Welcome back, {orgName}</h2>
        <p className="mt-0.5 text-sm text-gray-400">
          {tier === "enterprise_plus" ? "Enterprise+ workspace · 100+ member capacity" : "Enterprise workspace · 50 member capacity"}
        </p>
      </motion.div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { label: "Post a Project", icon: FolderPlus, tab: "projects", desc: "Source consultants across 20 categories" },
          { label: "Invite a Member", icon: UserPlus,  tab: "members",  desc: `${stats ? stats.maxMembers - stats.memberCount : 50} slots remaining` },
        ].map(({ label, icon: Icon, tab, desc }) => (
          <motion.button
            key={label}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTabChange(tab)}
            className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-[#c12129]/30 hover:bg-[#c12129]/5"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black group-hover:border-[#c12129]/30 group-hover:bg-[#c12129]/10">
              <Icon className="h-5 w-5 text-[#c12129]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 flex-shrink-0 text-gray-600 transition group-hover:translate-x-0.5 group-hover:text-[#c12129]" />
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Activity feed */}
        <div className={card}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">Recent Activity</h3>
          <ul className="space-y-3">
            {MOCK_ACTIVITY.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 flex-shrink-0">{STATUS_ICON[item.status]}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-300">{item.text}</p>
                  <p className="text-[11px] text-gray-600">{item.time}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Top consultants */}
        <div className={card}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">Top Consultants</h3>
          <ul className="space-y-3">
            {MOCK_CONSULTANTS.map((c, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-3 py-2.5 transition hover:border-white/10"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#c12129]/10 text-xs font-bold text-[#c12129]">
                  {c.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{c.name}</p>
                  <p className="truncate text-[11px] text-gray-500">{c.cat}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">★ {c.rating}</p>
                  <p className="text-[11px] text-gray-500">{c.projects} projects</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
