"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ProfileData {
  firstName?:      string;
  lastName?:       string;
  bio?:            string;
  profilePicture?: string;
  title?:          string;
  skills?:         string[];
  rate?:           number;
  industry?:       string;
  delivery?:       string;
}

interface Props {
  profile: ProfileData | null;
  dashboardPath: string; // "/client" or "/profile"
}

function calcCompletion(p: ProfileData | null): { pct: number; missing: string[] } {
  if (!p) return { pct: 0, missing: ["Complete your profile"] };

  const checks: { label: string; done: boolean }[] = [
    { label: "First name",      done: !!p.firstName },
    { label: "Last name",       done: !!p.lastName  },
    { label: "Profile photo",   done: !!p.profilePicture },
    { label: "Bio",             done: !!p.bio && p.bio.length > 20 },
    { label: "Job title",       done: !!p.title },
    { label: "Skills",          done: Array.isArray(p.skills) && p.skills.length > 0 },
    { label: "Hourly rate",     done: !!p.rate },
    { label: "Industry",        done: !!p.industry },
    { label: "Delivery method", done: !!p.delivery },
  ];

  const done    = checks.filter(c => c.done).length;
  const missing = checks.filter(c => !c.done).map(c => c.label);
  return { pct: Math.round((done / checks.length) * 100), missing };
}

export default function ProfileCompletionBar({ profile, dashboardPath }: Props) {
  const { pct, missing } = calcCompletion(profile);
  if (pct === 100) return null;

  const color = pct < 40 ? "bg-blue-500" : pct < 75 ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-white">Profile {pct}% complete</span>
        <Link href={`${dashboardPath}?tab=settings`} className="text-xs text-[#2563EB] hover:underline">
          Complete →
        </Link>
      </div>

      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {missing.length > 0 && (
        <p className="text-[11px] text-gray-500">
          Missing: {missing.slice(0, 3).join(", ")}{missing.length > 3 ? ` +${missing.length - 3} more` : ""}
        </p>
      )}
    </div>
  );
}
