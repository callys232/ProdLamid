"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcon, Inbox, FolderOpen, Users, MessageSquare, Bell, Search, DollarSign, Star } from "lucide-react";

interface Props {
  icon?:        LucideIcon;
  title:        string;
  description?: string;
  ctaLabel?:    string;
  ctaHref?:     string;
  ctaOnClick?:  () => void;
  className?:   string;
}

export default function EmptyState({ icon: Icon = Inbox, title, description, ctaLabel, ctaHref, ctaOnClick, className = "" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-14 text-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
        <Icon className="h-6 w-6 text-gray-500" />
      </div>
      <p className="text-sm font-semibold text-white">{title}</p>
      {description && <p className="max-w-xs text-xs text-gray-500">{description}</p>}
      {ctaLabel && (
        ctaHref ? (
          <Link href={ctaHref}
            className="mt-2 rounded-lg bg-[#c12129] px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700">
            {ctaLabel}
          </Link>
        ) : (
          <motion.button whileTap={{ scale: 0.97 }} onClick={ctaOnClick}
            className="mt-2 rounded-lg bg-[#c12129] px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700">
            {ctaLabel}
          </motion.button>
        )
      )}
    </motion.div>
  );
}

/* ── Pre-configured domain variants ──────────────────────────── */
export const Empty = {
  Projects:      (p?: Partial<Props>) => <EmptyState icon={FolderOpen}    title="No projects yet"       description="Projects you post or bid on will appear here."        {...p} />,
  Consultants:   (p?: Partial<Props>) => <EmptyState icon={Users}         title="No consultants found"  description="Try adjusting your filters or search terms."           {...p} />,
  Messages:      (p?: Partial<Props>) => <EmptyState icon={MessageSquare} title="No messages yet"       description="Messages from your projects will appear here."         {...p} />,
  Notifications: (p?: Partial<Props>) => <EmptyState icon={Bell}          title="All caught up"         description="You have no new notifications."                        {...p} />,
  Escrow:        (p?: Partial<Props>) => <EmptyState icon={DollarSign}    title="No escrow transactions"description="Funded milestones will appear here."                   {...p} />,
  Reviews:       (p?: Partial<Props>) => <EmptyState icon={Star}          title="No reviews yet"        description="Reviews from completed projects will appear here."     {...p} />,
  Search:        (q: string)          => <EmptyState icon={Search}        title={`No results for "${q}"`} description="Try a different search term or browse categories."    />,
};
