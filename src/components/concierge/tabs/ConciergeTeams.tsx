"use client";

import { motion } from "framer-motion";
import { Users, Mail, Shield, Crown, UserPlus } from "lucide-react";

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: i * 0.06 },
});

const MEMBERS = [
  { name: "Dr. Amaka Okafor",    role: "Dedicated PM",    email: "a.okafor@lamidconsulting.com", type: "pm" },
  { name: "Chidi Eze",           role: "Project Analyst",  email: "c.eze@lamidconsulting.com",    type: "internal" },
  { name: "Fatima Al-Hassan",    role: "Client Lead",      email: "fatima@gov.test",              type: "client" },
  { name: "Emmanuel Nwachukwu",  role: "Technical Lead",   email: "e.nwachukwu@gov.test",         type: "client" },
];

const TYPE_STYLE: Record<string, { label: string; color: string; icon: any }> = {
  pm:       { label: "Dedicated PM",   color: "text-[#c21219] bg-[#c21219]/10 border-[#c21219]/30", icon: Crown },
  internal: { label: "Lamid Team",     color: "text-blue-400 bg-blue-500/10 border-blue-500/30",    icon: Shield },
  client:   { label: "Your Team",      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", icon: Users },
};

export default function ConciergeTeams() {
  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div {...fadeUp(0)}>
        <h2 className="text-lg font-bold text-white mb-1">Programme Team</h2>
        <p className="text-xs text-gray-400">Your dedicated team across Lamid and your organisation.</p>
      </motion.div>

      {/* Members */}
      <div className="space-y-3">
        {MEMBERS.map((m, i) => {
          const cfg = TYPE_STYLE[m.type];
          const Icon = cfg.icon;
          return (
            <motion.div key={m.email} {...fadeUp(i + 1)}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 hover:border-white/20 transition">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/10 text-sm font-bold text-white flex-shrink-0">
                  {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{m.name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Mail className="h-3 w-3" />{m.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full border ${cfg.color}`}>
                  <Icon className="h-3 w-3" />{cfg.label}
                </span>
                <span className="text-xs text-gray-500">{m.role}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Invite */}
      <motion.div {...fadeUp(MEMBERS.length + 1)}
        className="rounded-xl border border-dashed border-white/15 bg-white/5 px-5 py-6 text-center">
        <UserPlus className="h-6 w-6 text-gray-500 mx-auto mb-2" />
        <p className="text-sm text-gray-400 mb-3">Need to add a team member?</p>
        <button className="px-5 py-2 rounded-xl bg-[#c21219] hover:bg-red-700 text-white text-sm font-semibold transition">
          Contact your PM to invite
        </button>
      </motion.div>
    </div>
  );
}
