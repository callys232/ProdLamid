"use client";

import { motion } from "framer-motion";
import { Building2, Users, DollarSign, FolderOpen, Bell, ShieldCheck } from "lucide-react";
import type { EnterpriseDashboardStats, OrgTier } from "@/types/enterprise";

interface Props {
  org: { name: string; logoUrl?: string; tier: OrgTier; status: string } | null;
  stats: EnterpriseDashboardStats | null;
  onTabChange: (tab: string) => void;
  alertCount?: number;
}

const TIER_STYLE: Record<OrgTier, string> = {
  enterprise:      "border-[#c12129]/40 bg-[#c12129]/10 text-[#c12129]",
  enterprise_plus: "border-purple-500/40 bg-purple-500/10 text-purple-400",
};

const TIER_LABEL: Record<OrgTier, string> = {
  enterprise:      "Enterprise",
  enterprise_plus: "Enterprise+",
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  onClick?: () => void;
}

function StatCard({ icon, label, value, sub, onClick }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex-1 min-w-[130px] rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:border-[#c12129]/30 hover:bg-[#c12129]/5 ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="mb-2 flex items-center gap-2 text-gray-500">
        <span className="text-[#c12129]">{icon}</span>
        <span className="text-[11px] font-semibold uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-gray-500">{sub}</p>}
    </motion.div>
  );
}

export default function EnterpriseHeader({ org, stats, onTabChange, alertCount = 0 }: Props) {
  const tier = (org?.tier ?? "enterprise") as OrgTier;

  return (
    <div className="border-b border-white/10 bg-gradient-to-r from-black via-[#0B0F19] to-black px-6 py-5">
      {/* Top row */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {org?.logoUrl ? (
            <img src={org.logoUrl} alt="org logo" className="h-10 w-10 rounded-xl object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
              <Building2 className="h-5 w-5 text-[#c12129]" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">{org?.name ?? "Your Organisation"}</h1>
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${TIER_STYLE[tier]}`}>
                {TIER_LABEL[tier]}
              </span>
              {org?.status === "trial" && (
                <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold text-yellow-400">
                  Trial
                </span>
              )}
            </div>
            <p className="text-[12px] text-gray-500">Enterprise Workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTabChange("notifications")}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition hover:border-[#c12129]/30 hover:text-white"
          >
            <Bell className="h-4 w-4" />
            {alertCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#c12129] text-[9px] font-bold text-white">
                {alertCount}
              </span>
            )}
          </motion.button>
          <motion.a
            href="/contact-sales"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="hidden rounded-lg border border-[#c12129]/30 bg-[#c12129]/10 px-4 py-2 text-xs font-semibold text-[#c12129] transition hover:bg-[#c12129]/20 sm:block"
          >
            Talk to Sales
          </motion.a>
        </div>
      </div>

      {/* Stat cards */}
      <div className="flex flex-wrap gap-3">
        <StatCard
          icon={<FolderOpen className="h-3.5 w-3.5" />}
          label="Active Projects"
          value={stats?.activeProjects ?? 0}
          sub={`of ${tier === "enterprise" ? 12 : "∞"} slots`}
          onClick={() => onTabChange("projects")}
        />
        <StatCard
          icon={<DollarSign className="h-3.5 w-3.5" />}
          label="Total Spend"
          value={stats ? `$${stats.totalSpend.toLocaleString()}` : "$0"}
          sub="this month"
          onClick={() => onTabChange("analytics")}
        />
        <StatCard
          icon={<Users className="h-3.5 w-3.5" />}
          label="Consultants"
          value={stats?.activeConsultants ?? 0}
          sub="active"
        />
        <StatCard
          icon={<Users className="h-3.5 w-3.5" />}
          label="Members"
          value={stats ? `${stats.memberCount} / ${stats.maxMembers}` : "— / 50"}
          sub={
            stats
              ? stats.memberCount / stats.maxMembers > 0.8
                ? "⚠ Near limit"
                : `${stats.nonConsultantMembers ?? stats.memberCount} internal · ${stats.pendingInvites} pending`
              : undefined
          }
          onClick={() => onTabChange("members")}
        />
        <StatCard
          icon={<ShieldCheck className="h-3.5 w-3.5" />}
          label="Admins"
          value={stats?.adminCount ?? 0}
          sub="org admin · manager"
          onClick={() => onTabChange("members")}
        />
      </div>
    </div>
  );
}
