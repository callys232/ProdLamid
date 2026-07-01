"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Network, TrendingUp, GraduationCap,
  Fingerprint, Compass, Link2, GitMerge, Activity, Zap,
  FileBarChart, BarChart3, Gauge, Repeat2, Settings2,
  ShieldAlert, ClipboardCheck, Landmark, Heart, Lock, Server, Repeat,
  Workflow, Microscope, GitBranch, CalendarCheck, Layout, Crosshair, RefreshCw, Briefcase,
  Radar, Map, Cpu, Search, TrendingDown, CalendarDays, FileText, Star, BarChart2,
  Brain, Users, GraduationCap as Cap, HeartHandshake, CheckSquare, ClipboardList,
  ArrowUpRight,
} from "lucide-react";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";

const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45, delay: d } });

const SECTIONS = [
  {
    label: "LAMID CORE",
    icon: Network,
    color: "text-[#C12129]",
    modules: [
      { title: "CORE Dashboard",          href: "/core-dashboard",             icon: Network },
      { title: "Workflow Engine",          href: "/core-workflow",              icon: Workflow },
      { title: "Diagnostic Engine",        href: "/core-diagnostic",            icon: Microscope },
      { title: "Transformation Planner",   href: "/core-transformation",        icon: GitBranch },
      { title: "Operating Rhythm Engine",  href: "/core-operating-rhythm",      icon: CalendarCheck },
      { title: "Blueprint Generator",      href: "/core-blueprint",             icon: Layout },
      { title: "Strategic Alignment",      href: "/core-strategic-alignment",   icon: Crosshair },
      { title: "Change Management Engine", href: "/core-change-management",     icon: RefreshCw },
      { title: "Executive Consulting Console",href: "/core-executive-console",  icon: Briefcase },
    ],
  },
  {
    label: "LAMID GROW",
    icon: TrendingUp,
    color: "text-[#C12129]",
    modules: [
      { title: "GROW Dashboard",           href: "/grow-dashboard",             icon: TrendingUp },
      { title: "Opportunity Signals",      href: "/grow-opportunity-signals",   icon: Radar },
      { title: "Growth Pathways",          href: "/grow-pathways",              icon: Map },
      { title: "Modernisation Readiness",  href: "/grow-modernisation",         icon: Cpu },
      { title: "Market Intelligence",      href: "/grow-market-intelligence",   icon: Search },
      { title: "Digital Maturity Model",   href: "/grow-digital-maturity",      icon: Gauge },
      { title: "Growth Planner",           href: "/grow-planner",               icon: CalendarDays },
      { title: "Advisory Console",         href: "/grow-advisory-console",      icon: Star },
      { title: "Executive Growth Report",  href: "/grow-executive-report",      icon: FileBarChart },
    ],
  },
  {
    label: "LAMID TALENT",
    icon: GraduationCap,
    color: "text-[#C12129]",
    modules: [
      { title: "TALENT Dashboard",         href: "/talent-dashboard",           icon: GraduationCap },
      { title: "Capability Intelligence",  href: "/talent-capability",          icon: Brain },
      { title: "Workforce Planning",       href: "/talent-workforce-planning",  icon: Users },
      { title: "Leadership Pipeline",      href: "/talent-leadership-pipeline", icon: GitMerge },
      { title: "Culture Intelligence",     href: "/talent-culture-intelligence",icon: Heart },
      { title: "Workforce Readiness",      href: "/talent-workforce-readiness", icon: CheckSquare },
      { title: "Talent Diagnostics",       href: "/talent-diagnostics",         icon: ClipboardList },
    ],
  },
  {
    label: "S-Series — Strategic Intelligence",
    icon: Fingerprint,
    color: "text-[#C12129]",
    modules: [
      { title: "S01 — Strategic Identity",   href: "/s01-strategic-identity",  icon: Fingerprint },
      { title: "S02 — Strategic Direction",  href: "/s02-strategic-direction", icon: Compass },
      { title: "S03 — Strategic Coherence",  href: "/s03-strategic-coherence", icon: Link2 },
      { title: "S04 — Strategic Convergence",href: "/s04-strategic-convergence",icon: GitMerge },
      { title: "S05 — Strategic Rhythm",     href: "/s05-strategic-rhythm",    icon: Activity },
      { title: "S06 — Strategic Flow",       href: "/s06-strategic-flow",      icon: Zap },
      { title: "S07 — Strategic Execution",  href: "/s07-execution",           icon: Settings2 },
      { title: "S08 — Strategic Renewal",    href: "/s08-renewal",             icon: Repeat2 },
    ],
  },
  {
    label: "X-Series — Protection Intelligence",
    icon: ShieldAlert,
    color: "text-[#C12129]",
    modules: [
      { title: "X01 — Risk Intelligence",      href: "/x01-risk",         icon: ShieldAlert },
      { title: "X02 — Compliance",             href: "/x02-compliance",   icon: ClipboardCheck },
      { title: "X03 — Governance",             href: "/x03-governance",   icon: Landmark },
      { title: "X04 — Ethics Intelligence",    href: "/x04-ethics",       icon: Heart },
      { title: "X05 — Security Intelligence",  href: "/x05-security",     icon: Lock },
      { title: "X06 — Resilience Intelligence",href: "/x06-resilience",   icon: Server },
      { title: "X07 — Continuity Intelligence",href: "/x07-continuity",   icon: Repeat },
    ],
  },
  {
    label: "Quality, Rhythm & Operations",
    icon: BarChart3,
    color: "text-[#C12129]",
    modules: [
      { title: "Quality Intelligence",     href: "/quality-intelligence",     icon: BarChart3 },
      { title: "Rhythm Intelligence",      href: "/rhythm-intelligence",      icon: Activity },
      { title: "Operations Intelligence",  href: "/operations-intelligence",  icon: Settings2 },
    ],
  },
];

export default function IntelligenceHubPage() {
  return (
    <DashboardTierGate pillar="Intelligence Hub" backHref="/" backLabel="Back to Home">
      <main className="aivora-section min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="mb-12">
            <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">LAMID ONE</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Intelligence Hub</h1>
            <p className="text-gray-500 dark:text-white/45 text-sm max-w-xl">Every module, every series, one place. Navigate the full LAMID ONE intelligence ecosystem — from strategic planning to protection, from growth to talent.</p>
          </motion.div>
          <div className="flex flex-col gap-10">
            {SECTIONS.map((section, si) => (
              <motion.div key={section.label} {...fadeUp(si * 0.05)}>
                <div className="flex items-center gap-2 mb-4">
                  <section.icon className={`w-4 h-4 ${section.color}`} strokeWidth={2.2} />
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/40">{section.label}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {section.modules.map((mod) => (
                    <Link key={mod.href} href={mod.href} className="aivora-card border rounded-2xl p-4 hover:border-[#C12129]/30 transition-colors group">
                      <mod.icon className="w-4 h-4 text-[#C12129] mb-3" strokeWidth={2.2} />
                      <p className="text-xs font-semibold text-gray-800 dark:text-white leading-snug group-hover:text-[#C12129] transition-colors">{mod.title}</p>
                      <ArrowUpRight className="w-3 h-3 text-gray-300 dark:text-white/20 mt-2 group-hover:text-[#C12129] transition-colors" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </DashboardTierGate>
  );
}
