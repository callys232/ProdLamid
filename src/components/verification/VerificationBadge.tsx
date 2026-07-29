"use client";

import { ShieldCheck, ShieldAlert, Clock, ShieldX } from "lucide-react";

type VerificationStatus = "approved" | "pending" | "rejected" | "unsubmitted";

interface VerificationBadgeProps {
  status: VerificationStatus;
  showLabel?: boolean;
  size?: "sm" | "md";
}

const CONFIG: Record<VerificationStatus, { icon: any; label: string; className: string }> = {
  approved:    { icon: ShieldCheck, label: "Verified",     className: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  pending:     { icon: Clock,       label: "Under Review", className: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
  rejected:    { icon: ShieldX,     label: "Not Verified", className: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  unsubmitted: { icon: ShieldAlert, label: "Unverified",   className: "text-gray-600 bg-white/5 border-white/10" },
};

export default function VerificationBadge({ status, showLabel = true, size = "md" }: VerificationBadgeProps) {
  const { icon: Icon, label, className } = CONFIG[status] ?? CONFIG.unsubmitted;
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-medium ${className} ${textSize}`}>
      <Icon className={iconSize} />
      {showLabel && label}
    </span>
  );
}
