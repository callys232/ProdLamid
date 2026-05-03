"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Zap, ArrowRight } from "lucide-react";
import type { OrgTier } from "@/types/enterprise";

interface Props { tier: OrgTier; orgStatus: string }

const MOCK_INVOICES = [
  { id: "INV-0041", date: "2026-04-01", amount: 18500, status: "paid",    cycle: "monthly" },
  { id: "INV-0040", date: "2026-03-01", amount: 18500, status: "paid",    cycle: "monthly" },
  { id: "INV-0039", date: "2026-02-01", amount: 18500, status: "paid",    cycle: "monthly" },
  { id: "INV-0038", date: "2026-01-01", amount: 18500, status: "pending", cycle: "monthly" },
];

const STATUS_STYLE: Record<string, string> = {
  paid:    "border-green-500/30 bg-green-500/10 text-green-400",
  pending: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  failed:  "border-red-500/30 bg-red-500/10 text-red-400",
};

const ENTERPRISE_FEATURES = [
  "Up to 50 team members",
  "Up to 12 active projects",
  "Milestone escrow management",
  "Executive analytics dashboard",
  "Custom contract templates",
  "Priority 48hr deployment SLA",
  "24/7 support via Slack",
];

const ENTERPRISE_PLUS_FEATURES = [
  "100+ team members (custom scaling)",
  "Unlimited active projects",
  "White-label portal",
  "Dedicated account director",
  "Emergency 6hr staffing SLA",
  "Custom API integrations",
  "Quarterly strategy reviews",
];

type BillingCycle = "monthly" | "quarterly" | "annual";

const ENTERPRISE_PRICES: Record<BillingCycle, number>  = { monthly: 18500, quarterly: 52500, annual: 200000 };
const ENTERPRISE_SAVINGS: Partial<Record<BillingCycle, string>> = { quarterly: "Save $3,000 vs monthly", annual: "Save $22,000" };
const PER_LABEL: Record<BillingCycle, string> = { monthly: "/mo", quarterly: "/qtr", annual: "/yr" };

export default function Billing({ tier, orgStatus }: Props) {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const price = ENTERPRISE_PRICES[cycle];

  return (
    <div className="space-y-6 p-6">
      {/* Trial banner */}
      {orgStatus === "trial" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 px-5 py-4"
        >
          <p className="text-sm font-semibold text-yellow-400">You're on a free trial</p>
          <p className="mt-0.5 text-xs text-gray-400">Add payment details to keep your workspace active after the trial ends.</p>
        </motion.div>
      )}

      {/* Billing toggle */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">Billing cycle:</span>
        {(["monthly", "annual"] as const).map(c => (
          <motion.button
            key={c}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCycle(c)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${
              cycle === c
                ? "bg-[#c12129] text-white"
                : "border border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            {c}
          </motion.button>
        ))}
        {cycle === "annual" && (
          <span className="text-xs font-semibold text-green-400">Save $22,000</span>
        )}
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Enterprise */}
        <motion.div
          whileHover={{ y: -2 }}
          className={`rounded-xl border p-5 transition ${
            tier === "enterprise"
              ? "border-[#c12129]/40 bg-[#c12129]/5"
              : "border-white/10 bg-white/5"
          }`}
        >
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-bold text-white">Enterprise</h3>
            {tier === "enterprise" && (
              <span className="rounded-full border border-[#c12129]/40 bg-[#c12129]/10 px-2 py-0.5 text-[10px] font-bold text-[#c12129]">
                Current Plan
              </span>
            )}
          </div>
          <p className="mb-4 text-2xl font-black text-white">
            ${price.toLocaleString()}
            <span className="ml-1 text-sm font-normal text-gray-500">/{cycle === "annual" ? "yr" : "mo"}</span>
          </p>
          <ul className="mb-5 space-y-2">
            {ENTERPRISE_FEATURES.map(f => (
              <li key={f} className="flex items-center gap-2 text-xs text-gray-400">
                <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 text-[#c12129]" />{f}
              </li>
            ))}
          </ul>
          {tier !== "enterprise" && (
            <a href="/contact-sales" className="block w-full rounded-lg border border-[#c12129]/30 py-2.5 text-center text-sm font-semibold text-[#c12129] transition hover:bg-[#c12129]/10">
              Downgrade
            </a>
          )}
        </motion.div>

        {/* Enterprise+ */}
        <motion.div
          whileHover={{ y: -2 }}
          className={`rounded-xl border p-5 transition ${
            tier === "enterprise_plus"
              ? "border-purple-500/40 bg-purple-500/5"
              : "border-white/10 bg-white/5"
          }`}
        >
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white">Enterprise+</h3>
              <Zap className="h-3.5 w-3.5 text-purple-400" />
            </div>
            {tier === "enterprise_plus" && (
              <span className="rounded-full border border-purple-500/40 bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-400">
                Current Plan
              </span>
            )}
          </div>
          <p className="mb-4 text-2xl font-black text-white">
            Custom
            <span className="ml-1 text-sm font-normal text-gray-500">pricing</span>
          </p>
          <ul className="mb-5 space-y-2">
            {ENTERPRISE_PLUS_FEATURES.map(f => (
              <li key={f} className="flex items-center gap-2 text-xs text-gray-400">
                <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 text-purple-400" />{f}
              </li>
            ))}
          </ul>
          <motion.a
            href="/contact-sales"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c12129] py-2.5 text-center text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Talk to Sales <ArrowRight className="h-3.5 w-3.5" />
          </motion.a>
        </motion.div>
      </div>

      {/* Invoice table */}
      <div className="rounded-xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-5 py-3">
          <h3 className="text-sm font-semibold text-white">Invoice History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-widest text-gray-500">
                <th className="px-5 py-3 text-left font-medium">Invoice</th>
                <th className="px-5 py-3 text-left font-medium">Date</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
                <th className="px-5 py-3 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_INVOICES.map((inv, i) => (
                <motion.tr
                  key={inv.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="transition hover:bg-white/5"
                >
                  <td className="px-5 py-3 font-mono text-xs text-gray-300">{inv.id}</td>
                  <td className="px-5 py-3 text-gray-400">{inv.date}</td>
                  <td className="px-5 py-3 text-right font-semibold text-white">${inv.amount.toLocaleString()}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold capitalize ${STATUS_STYLE[inv.status]}`}>
                      {inv.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
