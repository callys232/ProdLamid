"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Network, TrendingUp, GraduationCap, Fingerprint, Compass, Link2, GitMerge,
  Activity, Zap, FileBarChart, BarChart3, Gauge, Repeat2, Settings2, ShieldAlert,
  ClipboardCheck, Landmark, Heart, Lock, Server, Repeat, Workflow, Microscope,
  GitBranch, CalendarCheck, Layout, Crosshair, RefreshCw, Briefcase, Radar, Map,
  Cpu, Search, TrendingDown, CalendarDays, Star, Users, CheckSquare, ClipboardList,
  Award, Shield, Scale, Waves, Music2, HeartHandshake, Sparkles, Anchor, Globe,
  Wind, Layers, Eye, Share2, AlertTriangle, Shuffle, Lightbulb, Package, Clock,
  AlignJustify, FlaskConical, Navigation, MapPin, ArrowUpRight, ChevronDown,
} from "lucide-react";
import { useState } from "react";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";

const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45, delay: d } });

const SECTIONS = [
  /* ── LAMID CORE ─────────────────────────────────────────── */
  {
    label: "LAMID CORE — Consulting Operating System",
    badge: "C-Series",
    icon: Network,
    modules: [
      { title: "CORE Dashboard",           href: "/core-dashboard",              icon: Network },
      { title: "Workflow Engine",           href: "/core-workflow",               icon: Workflow },
      { title: "Diagnostic Engine",         href: "/core-diagnostic",             icon: Microscope },
      { title: "Transformation Planner",    href: "/core-transformation",         icon: GitBranch },
      { title: "Operating Rhythm",          href: "/core-operating-rhythm",       icon: CalendarCheck },
      { title: "Blueprint Generator",       href: "/core-blueprint",              icon: Layout },
      { title: "Strategic Alignment",       href: "/core-strategic-alignment",    icon: Crosshair },
      { title: "Change Management",         href: "/core-change-management",      icon: RefreshCw },
      { title: "Executive Console",         href: "/core-executive-console",      icon: Briefcase },
    ],
  },
  /* ── LAMID GROW ─────────────────────────────────────────── */
  {
    label: "LAMID GROW — Digital Growth & Advisory",
    badge: "G-Series",
    icon: TrendingUp,
    modules: [
      { title: "GROW Dashboard",            href: "/grow-dashboard",              icon: TrendingUp },
      { title: "Opportunity Signals",       href: "/grow-opportunity-signals",    icon: Radar },
      { title: "Growth Pathways",           href: "/grow-pathways",               icon: Map },
      { title: "Modernisation Readiness",   href: "/grow-modernisation",          icon: Cpu },
      { title: "Market Intelligence",       href: "/grow-market-intelligence",    icon: Search },
      { title: "Digital Maturity Model",    href: "/grow-digital-maturity",       icon: Gauge },
      { title: "Growth Planner",            href: "/grow-planner",                icon: CalendarDays },
      { title: "Advisory Console",          href: "/grow-advisory-console",       icon: Star },
      { title: "Executive Growth Report",   href: "/grow-executive-report",       icon: FileBarChart },
    ],
  },
  /* ── LAMID TALENT ───────────────────────────────────────── */
  {
    label: "LAMID TALENT — Workforce Intelligence",
    badge: "A-Series",
    icon: GraduationCap,
    modules: [
      { title: "TALENT Dashboard",          href: "/talent-dashboard",            icon: GraduationCap },
      { title: "Capability Intelligence",   href: "/talent-capability",           icon: Award },
      { title: "Workforce Planning",        href: "/talent-workforce-planning",   icon: Users },
      { title: "Leadership Pipeline",       href: "/talent-leadership-pipeline",  icon: GitMerge },
      { title: "Culture Intelligence",      href: "/talent-culture-intelligence", icon: Heart },
      { title: "Workforce Readiness",       href: "/talent-workforce-readiness",  icon: CheckSquare },
      { title: "Talent Diagnostics",        href: "/talent-diagnostics",          icon: ClipboardList },
    ],
  },
  /* ── S-SERIES ───────────────────────────────────────────── */
  {
    label: "S-Series — Strategic Intelligence",
    badge: "S01–S12",
    icon: Fingerprint,
    modules: [
      { title: "S01 — Strategic Identity",      href: "/s01-strategic-identity",      icon: Fingerprint },
      { title: "S02 — Strategic Direction",     href: "/s02-strategic-direction",     icon: Compass },
      { title: "S03 — Strategic Coherence",     href: "/s03-strategic-coherence",     icon: Link2 },
      { title: "S04 — Strategic Convergence",   href: "/s04-strategic-convergence",   icon: GitMerge },
      { title: "S05 — Strategic Rhythm",        href: "/s05-strategic-rhythm",        icon: Activity },
      { title: "S06 — Strategic Flow",          href: "/s06-strategic-flow",          icon: Zap },
      { title: "S07 — Strategic Execution",     href: "/s07-execution",               icon: Settings2 },
      { title: "S08 — Strategic Renewal",       href: "/s08-renewal",                 icon: Repeat2 },
      { title: "S09 — Strategic Innovation",    href: "/s09-strategic-innovation",    icon: Lightbulb },
      { title: "S10 — Strategic Leadership",    href: "/s10-strategic-leadership",    icon: Users },
      { title: "S11 — Strategic Culture",       href: "/s11-strategic-culture",       icon: Heart },
      { title: "S12 — Strategic Transformation",href: "/s12-strategic-transformation",icon: GitBranch },
    ],
  },
  /* ── R-SERIES ───────────────────────────────────────────── */
  {
    label: "R-Series — Rhythm Intelligence",
    badge: "R01–R30",
    icon: Activity,
    modules: [
      { title: "R01 — Rhythm Mapping",        href: "/r01-rhythm-mapping",        icon: MapPin },
      { title: "R02 — Rhythm Velocity",       href: "/r02-rhythm-velocity",       icon: Zap },
      { title: "R03 — Rhythm Drift",          href: "/r03-rhythm-drift",          icon: AlertTriangle },
      { title: "R04 — Rhythm Stability",      href: "/r04-rhythm-stability",      icon: Anchor },
      { title: "R05 — Rhythm Balance",        href: "/r05-rhythm-balance",        icon: Scale },
      { title: "R06 — Rhythm Harmony",        href: "/r06-rhythm-harmony",        icon: Music2 },
      { title: "R07 — Rhythm Coherence",      href: "/r07-rhythm-coherence",      icon: Link2 },
      { title: "R08 — Rhythm Integration",    href: "/r08-rhythm-integration",    icon: GitMerge },
      { title: "R09 — Rhythm Alignment",      href: "/r09-rhythm-alignment",      icon: Compass },
      { title: "R10 — Rhythm Convergence",    href: "/r10-rhythm-convergence",    icon: Crosshair },
      { title: "R11 — Rhythm Synchronization",href: "/r11-rhythm-synchronization",icon: RefreshCw },
      { title: "R12 — Rhythm Flow",           href: "/r12-rhythm-flow",           icon: Wind },
      { title: "R13 — Rhythm Resonance",      href: "/r13-rhythm-resonance",      icon: Waves },
      { title: "R14 — Rhythm Pulse",          href: "/r14-rhythm-pulse",          icon: Heart },
      { title: "R15 — Rhythm Signature",      href: "/r15-rhythm-signature",      icon: Fingerprint },
      { title: "R16 — Rhythm Identity",       href: "/r16-rhythm-identity",       icon: Users },
      { title: "R17 — Rhythm Essence",        href: "/r17-rhythm-essence",        icon: Sparkles },
      { title: "R18 — Rhythm Spirit",         href: "/r18-rhythm-spirit",         icon: Zap },
      { title: "R19 — Rhythm Field",          href: "/r19-rhythm-field",          icon: Globe },
      { title: "R20 — Rhythm Domain",         href: "/r20-rhythm-domain",         icon: Layout },
      { title: "R21 — Rhythm Realm",          href: "/r21-rhythm-realm",          icon: Globe },
      { title: "R22 — Rhythm Universe",       href: "/r22-rhythm-universe",       icon: Star },
      { title: "R23 — Rhythm Infinity",       href: "/r23-rhythm-infinity",       icon: Zap },
      { title: "R24 — Rhythm Continuum",      href: "/r24-rhythm-continuum",      icon: Link2 },
      { title: "R25 — Rhythm Origin",         href: "/r25-rhythm-origin",         icon: Sparkles },
      { title: "R26 — Rhythm Source",         href: "/r26-rhythm-source",         icon: Layers },
      { title: "R27 — Rhythm Apex",           href: "/r27-rhythm-apex",           icon: TrendingUp },
      { title: "R28 — Rhythm Sovereign",      href: "/r28-rhythm-sovereign",      icon: Shield },
      { title: "R29 — Rhythm Crown",          href: "/r29-rhythm-crown",          icon: Award },
      { title: "R30 — Rhythm Totality",       href: "/r30-rhythm-totality",       icon: Globe },
    ],
  },
  /* ── Q-SERIES ───────────────────────────────────────────── */
  {
    label: "Q-Series — Quality Intelligence",
    badge: "Q01–Q15",
    icon: Award,
    modules: [
      { title: "Q01 — Quality Mapping",      href: "/q01-quality-mapping",       icon: Activity },
      { title: "Q02 — Quality Velocity",     href: "/q02-quality-velocity",      icon: Zap },
      { title: "Q03 — Quality Drift",        href: "/q03-quality-drift",         icon: AlertTriangle },
      { title: "Q04 — Quality Assurance",    href: "/q04-quality-assurance",     icon: Shield },
      { title: "Q05 — Quality Excellence",   href: "/q05-quality-excellence",    icon: Star },
      { title: "Q06 — Quality Resilience",   href: "/q06-quality-resilience",    icon: Anchor },
      { title: "Q07 — Quality Continuity",   href: "/q07-quality-continuity",    icon: RefreshCw },
      { title: "Q08 — Quality Stability",    href: "/q08-quality-stability",     icon: Layers },
      { title: "Q09 — Quality Balance",      href: "/q09-quality-balance",       icon: Scale },
      { title: "Q10 — Quality Harmony",      href: "/q10-quality-harmony",       icon: Music2 },
      { title: "Q11 — Quality Coherence",    href: "/q11-quality-coherence",     icon: Link2 },
      { title: "Q12 — Quality Integration",  href: "/q12-quality-integration",   icon: GitMerge },
      { title: "Q13 — Quality Alignment",    href: "/q13-quality-alignment",     icon: Compass },
      { title: "Q14 — Quality Convergence",  href: "/q14-quality-convergence",   icon: GitMerge },
      { title: "Q15 — Quality Flow",         href: "/q15-quality-flow",          icon: Wind },
    ],
  },
  /* ── X-SERIES ───────────────────────────────────────────── */
  {
    label: "X-Series — Protection Intelligence",
    badge: "X01–X07",
    icon: ShieldAlert,
    modules: [
      { title: "X01 — Risk Intelligence",       href: "/x01-risk",         icon: ShieldAlert },
      { title: "X02 — Compliance",              href: "/x02-compliance",   icon: ClipboardCheck },
      { title: "X03 — Governance",              href: "/x03-governance",   icon: Landmark },
      { title: "X04 — Ethics Intelligence",     href: "/x04-ethics",       icon: Heart },
      { title: "X05 — Security Intelligence",   href: "/x05-security",     icon: Lock },
      { title: "X06 — Resilience Intelligence", href: "/x06-resilience",   icon: Server },
      { title: "X07 — Continuity Intelligence", href: "/x07-continuity",   icon: Repeat },
    ],
  },
  /* ── Z-SERIES ───────────────────────────────────────────── */
  {
    label: "Z-Series — Singularity Intelligence",
    badge: "Z01–Z15",
    icon: Globe,
    modules: [
      { title: "Z01 — Singularity Mapping",        href: "/z01-singularity-mapping",        icon: Globe },
      { title: "Z02 — Singularity Velocity",       href: "/z02-singularity-velocity",       icon: Zap },
      { title: "Z03 — Singularity Drift",          href: "/z03-singularity-drift",          icon: AlertTriangle },
      { title: "Z04 — Singularity Stability",      href: "/z04-singularity-stability",      icon: Anchor },
      { title: "Z05 — Singularity Convergence",    href: "/z05-singularity-convergence",    icon: GitMerge },
      { title: "Z06 — Singularity Flow",           href: "/z06-singularity-flow",           icon: Wind },
      { title: "Z07 — Singularity Identity",       href: "/z07-singularity-identity",       icon: Fingerprint },
      { title: "Z08 — Cosmic Intelligence",        href: "/z08-cosmic-intelligence",        icon: Globe },
      { title: "Z09 — Cosmic Coherence",           href: "/z09-cosmic-coherence",           icon: Link2 },
      { title: "Z10 — Cosmic Convergence",         href: "/z10-cosmic-convergence",         icon: GitMerge },
      { title: "Z11 — Cosmic Flow",               href: "/z11-cosmic-flow",               icon: Wind },
      { title: "Z12 — Cosmic Renewal",            href: "/z12-cosmic-renewal",            icon: RefreshCw },
      { title: "Z13 — Enterprise Consciousness",   href: "/z13-enterprise-consciousness",   icon: Cpu },
      { title: "Z14 — Consciousness Coherence",    href: "/z14-consciousness-coherence",    icon: Eye },
      { title: "Z15 — Consciousness Flow",         href: "/z15-consciousness-flow",         icon: Waves },
    ],
  },
  /* ── P-SERIES ───────────────────────────────────────────── */
  {
    label: "P-Series — Enterprise Productivity & Flow",
    badge: "P01–P30",
    icon: Settings2,
    modules: [
      { title: "P01 — Productivity Mapping",      href: "/p01-productivity-mapping",      icon: Activity },
      { title: "P02 — Productivity Velocity",     href: "/p02-productivity-velocity",     icon: Zap },
      { title: "P03 — Productivity Drift",        href: "/p03-productivity-drift",        icon: AlertTriangle },
      { title: "P04 — Productivity Stability",    href: "/p04-productivity-stability",    icon: Anchor },
      { title: "P05 — Productivity Balance",      href: "/p05-productivity-balance",      icon: Scale },
      { title: "P06 — Productivity Harmony",      href: "/p06-productivity-harmony",      icon: Music2 },
      { title: "P07 — Productivity Coherence",    href: "/p07-productivity-coherence",    icon: Link2 },
      { title: "P08 — Productivity Integration",  href: "/p08-productivity-integration",  icon: GitMerge },
      { title: "P09 — Productivity Alignment",    href: "/p09-productivity-alignment",    icon: Compass },
      { title: "P10 — Productivity Performance",  href: "/p10-productivity-performance",  icon: TrendingUp },
      { title: "P11 — Productivity Excellence",   href: "/p11-productivity-excellence",   icon: Star },
      { title: "P12 — Productivity Delivery",     href: "/p12-productivity-delivery",     icon: Package },
      { title: "P13 — Productivity Execution",    href: "/p13-productivity-execution",    icon: GitBranch },
      { title: "P14 — Productivity Optimisation", href: "/p14-productivity-optimisation", icon: Settings2 },
      { title: "P15 — Productivity Intelligence", href: "/p15-productivity-intelligence", icon: BarChart3 },
      { title: "P16 — Team Productivity",         href: "/p16-team-productivity",         icon: Users },
      { title: "P17 — Collaboration Engine",      href: "/p17-collaboration-engine",      icon: Share2 },
      { title: "P18 — Communication Engine",      href: "/p18-communication-engine",      icon: HeartHandshake },
      { title: "P19 — Engagement Engine",         href: "/p19-engagement-engine",         icon: Heart },
      { title: "P20 — Capability Engine",         href: "/p20-capability-engine",         icon: Award },
      { title: "P21 — Process Optimisation",      href: "/p21-process-optimisation",      icon: RefreshCw },
      { title: "P22 — Workflow Intelligence",     href: "/p22-workflow-intelligence",     icon: Cpu },
      { title: "P23 — Systems Productivity",      href: "/p23-systems-productivity",      icon: Server },
      { title: "P24 — Technology Productivity",   href: "/p24-technology-productivity",   icon: Cpu },
      { title: "P25 — Innovation Productivity",   href: "/p25-innovation-productivity",   icon: Lightbulb },
      { title: "P26 — Transformation Engine",     href: "/p26-transformation-engine",     icon: GitBranch },
      { title: "P27 — Change Engine",             href: "/p27-change-engine",             icon: RefreshCw },
      { title: "P28 — Convergence",               href: "/p28-convergence",               icon: GitMerge },
      { title: "P29 — Synchronization",           href: "/p29-synchronization",           icon: Repeat },
      { title: "P30 — Flow Engine",               href: "/p30-flow",                      icon: Wind },
    ],
  },
  /* ── OPERATIONS, QUALITY & RHYTHM ──────────────────────── */
  {
    label: "Platform Intelligence",
    badge: "Dashboards",
    icon: BarChart3,
    modules: [
      { title: "Quality Intelligence",      href: "/quality-intelligence",      icon: Award },
      { title: "Rhythm Intelligence",       href: "/rhythm-intelligence",       icon: Activity },
      { title: "Operations Intelligence",   href: "/operations-intelligence",   icon: Settings2 },
    ],
  },
];

export default function IntelligenceHubPage() {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setCollapsed(p => ({ ...p, [i]: !p[i] }));

  const totalModules = SECTIONS.reduce((acc, s) => acc + s.modules.length, 0);

  return (
    <DashboardTierGate pillar="Intelligence Hub" backHref="/" backLabel="Back to Home">
      <main className="aivora-section min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div {...fadeUp(0)} className="mb-12">
            <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">LAMID ONE</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Intelligence Hub</h1>
            <p className="text-gray-500 dark:text-white/45 text-sm max-w-xl mb-4">
              Every intelligence module in the LAMID ONE ecosystem — {totalModules} engines across {SECTIONS.length} series. One entry point.
            </p>
            <div className="flex flex-wrap gap-2">
              {SECTIONS.map(s => (
                <span key={s.badge} className="text-[9px] font-bold px-2 py-1 rounded-full border border-[#C12129]/20 text-[#C12129] bg-[#C12129]/6">{s.badge}</span>
              ))}
            </div>
          </motion.div>

          {/* Sections */}
          <div className="flex flex-col gap-6">
            {SECTIONS.map((section, si) => {
              const isOpen = !collapsed[si];
              return (
                <motion.div key={section.label} {...fadeUp(si * 0.03)}>
                  {/* Section header */}
                  <button
                    type="button"
                    onClick={() => toggle(si)}
                    className="w-full flex items-center gap-3 mb-3 group"
                  >
                    <section.icon className="w-4 h-4 text-[#C12129] shrink-0" strokeWidth={2.2} />
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/40 flex-1 text-left group-hover:text-gray-700 dark:group-hover:text-white/60 transition-colors">
                      {section.label}
                    </p>
                    <span className="text-[9px] font-bold text-[#C12129] bg-[#C12129]/10 px-1.5 py-0.5 rounded-full">
                      {section.modules.length}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-gray-400 dark:text-white/30 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Module grid */}
                  {isOpen && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                      {section.modules.map((mod) => (
                        <Link
                          key={mod.href}
                          href={mod.href}
                          className="aivora-card border rounded-xl p-3 hover:border-[#C12129]/30 transition-colors group flex flex-col gap-1.5"
                        >
                          <mod.icon className="w-3.5 h-3.5 text-[#C12129]" strokeWidth={2.2} />
                          <p className="text-[10px] font-semibold text-gray-700 dark:text-white/70 leading-snug group-hover:text-gray-900 dark:group-hover:text-white transition-colors line-clamp-2">
                            {mod.title}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </DashboardTierGate>
  );
}
