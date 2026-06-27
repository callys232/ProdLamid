"use client";

import { motion } from "framer-motion";
import { Users, Globe, Heart, TrendingUp, BookOpen, Handshake } from "lucide-react";

const stats = [
  { icon: Users,      value: "50,000+", label: "Lives Impacted",         color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  { icon: Globe,      value: "12+",     label: "Countries Reached",      color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/30" },
  { icon: Handshake,  value: "5,000+",  label: "Cooperatives Supported", color: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/30" },
  { icon: Heart,      value: "40+",     label: "Healthcare Partnerships", color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/30" },
  { icon: BookOpen,   value: "200+",    label: "Training Programmes",    color: "text-purple-400",  bg: "bg-purple-500/10",  border: "border-purple-500/30" },
  { icon: TrendingUp, value: "25+",     label: "Years of Impact",        color: "text-yellow-400",  bg: "bg-yellow-500/10",  border: "border-yellow-500/30" },
];

const pillars = [
  { title: "Gender Equality",        desc: "Empowering women-led entrepreneurial clusters and advocacy programmes across communities." },
  { title: "Healthcare Partnerships",desc: "Managed primary healthcare delivery and community health sustainability post-grant withdrawal." },
  { title: "Climate Action",         desc: "Building renewable energy services clusters with Shell in the Niger Delta communities." },
  { title: "Digital Inclusion",      desc: "Bridging the generational divide through youth upskilling, startup support, and tech adoption." },
];

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: i * 0.07, ease: [0.33, 1, 0.68, 1] },
});

export default function SDImpactDashboard() {
  return (
    <section className="bg-black text-white px-6 md:px-12 pb-12">
      {/* Section label */}
      <motion.div {...fadeUp(0)} className="max-w-6xl mx-auto mb-8">
        <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-full">
          Impact Dashboard
        </span>
      </motion.div>

      {/* Stats grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            {...fadeUp(i)}
            className={`rounded-xl border p-4 flex flex-col items-center text-center ${s.bg} ${s.border}`}
          >
            <s.icon className={`h-5 w-5 mb-2 ${s.color}`} />
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5 leading-snug">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Pillars */}
      <motion.h3 {...fadeUp(0)} className="max-w-6xl mx-auto text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
        Our Focus Areas
      </motion.h3>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            {...fadeUp(i)}
            className="rounded-xl border border-white/10 bg-white/5 p-5 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-colors duration-300"
          >
            <h4 className="text-sm font-semibold text-white mb-2">{p.title}</h4>
            <p className="text-xs text-gray-400 leading-relaxed text-justify">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
