"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import ModuleBrowser from "@/components/lamidOne/ModuleBrowser";
import {
  Network, TrendingUp, GraduationCap, Fingerprint, Compass, Link2, GitMerge,
  Activity, Zap, FileBarChart, BarChart3, Gauge, Repeat2, Settings2, ShieldAlert,
  ClipboardCheck, Landmark, Heart, Lock, Server, Repeat, Workflow, Microscope, TrendingDown,
  GitBranch, CalendarCheck, Layout, Crosshair, RefreshCw, Briefcase, Radar, Map,
  Cpu, Search, CalendarDays, Star, Users, CheckSquare, ClipboardList,
  Award, Shield, Scale, Waves, Music2, HeartHandshake, Sparkles, Anchor, Globe,
  Wind, Layers, Eye, Share2, AlertTriangle, Shuffle, Lightbulb, Package, Clock,
  AlignJustify, FlaskConical, Navigation, MapPin, ArrowUpRight, ChevronDown,
} from "lucide-react";
import { useState } from "react";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";

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
    label: "LAMID TALENT — Workforce Intelligence (A-Series)",
    badge: "A01–A32",
    icon: GraduationCap,
    modules: [
      { title: "A01 — Talent Intelligence Dashboard",       href: "/talent-dashboard",              icon: GraduationCap },
      { title: "A02 — Capability Intelligence",             href: "/talent-capability",             icon: Award },
      { title: "A03 — Workforce Planning",                  href: "/talent-workforce-planning",     icon: Users },
      { title: "A04 — Leadership Pipeline",                 href: "/talent-leadership-pipeline",    icon: GitMerge },
      { title: "A05 — Culture Intelligence",                href: "/talent-culture-intelligence",   icon: Heart },
      { title: "A06 — Workforce Readiness",                 href: "/talent-workforce-readiness",    icon: CheckSquare },
      { title: "A07 — Talent Diagnostics",                  href: "/talent-diagnostics",            icon: ClipboardList },
      { title: "A08 — Talent Risk Intelligence",            href: "/a08-talent-risk",               icon: ShieldAlert },
      { title: "A09 — Talent Opportunity Intelligence",     href: "/a09-talent-opportunity",        icon: Lightbulb },
      { title: "A10 — Talent Performance Intelligence",     href: "/a10-talent-performance",        icon: TrendingUp },
      { title: "A11 — Talent Engagement Intelligence",      href: "/a11-talent-engagement",         icon: HeartHandshake },
      { title: "A12 — Talent Sentiment Intelligence",       href: "/a12-talent-sentiment",          icon: Activity },
      { title: "A13 — Talent Experience Intelligence",      href: "/a13-talent-experience",         icon: Sparkles },
      { title: "A14 — Talent Lifecycle Intelligence",       href: "/a14-talent-lifecycle",          icon: RefreshCw },
      { title: "A15 — Capability Uplift Engine",            href: "/a15-capability-uplift",         icon: ArrowUpRight },
      { title: "A16 — Leadership Uplift Engine",            href: "/a16-leadership-uplift",         icon: GitBranch },
      { title: "A17 — Talent Acceleration I",               href: "/a17-talent-acceleration-i",     icon: Zap },
      { title: "A18 — Talent Acceleration II",              href: "/a18-talent-acceleration-ii",    icon: Zap },
      { title: "A19 — Talent Acceleration III",             href: "/a19-talent-acceleration-iii",   icon: Zap },
      { title: "A20 — Talent Acceleration IV",              href: "/a20-talent-acceleration-iv",    icon: Zap },
      { title: "A21 — Succession & Pipeline Engine",        href: "/a21-succession-pipeline",       icon: GitMerge },
      { title: "A22 — Bench Strength Engine",               href: "/a22-bench-strength",            icon: BarChart3 },
      { title: "A23 — Behavioral Competency Engine",        href: "/a23-behavioral-competency",     icon: FlaskConical },
      { title: "A24 — Performance-Capability Alignment",    href: "/a24-performance-alignment",     icon: Crosshair },
      { title: "A25 — Career Pathing Engine",               href: "/a25-career-pathing",            icon: Navigation },
      { title: "A26 — Workforce Planning & Forecasting",    href: "/a26-workforce-forecasting",     icon: CalendarDays },
      { title: "A27 — Engagement & Culture Signals",        href: "/a27-engagement-signals",        icon: Radar },
      { title: "A28 — Executive Talent Intelligence",       href: "/a28-executive-talent",          icon: Briefcase },
      { title: "A29 — Enterprise Integration Engine",       href: "/a29-enterprise-integration",    icon: Share2 },
      { title: "A30 — Enterprise Talent Fabric Engine",     href: "/a30-talent-fabric",             icon: Layers },
      { title: "A31 — Enterprise Talent Flow Engine",       href: "/a31-talent-flow",               icon: Wind },
      { title: "A32 — ETOS — Enterprise Talent OS",         href: "/a32-etos",                      icon: Star },
    ],
  },
  /* ── S-SERIES ───────────────────────────────────────────── */
  {
    label: "S-Series — Strategic Intelligence",
    badge: "S01–S12",
    icon: Fingerprint,
    modules: [
      { title: "S01 — Strategic Identity Statement",       href: "/s01-strategic-identity",      icon: Fingerprint },
      { title: "S02 — Strategic Direction Setter",         href: "/s02-strategic-direction",     icon: Compass },
      { title: "S03 — Strategy Consistency Check",         href: "/s03-strategic-coherence",     icon: Link2 },
      { title: "S04 — Cross-Function Strategy Alignment",  href: "/s04-strategic-convergence",   icon: GitMerge },
      { title: "S05 — Strategic Execution Cadence",        href: "/s05-strategic-rhythm",        icon: Activity },
      { title: "S06 — Strategy Execution Tracker",         href: "/s06-strategic-flow",          icon: Zap },
      { title: "S07 — Strategic Cadence Impact Map",       href: "/s07-strategic-field",         icon: Layers },
      { title: "S08 — Strategic Momentum Score",           href: "/s08-strategic-force",         icon: Zap },
      { title: "S09 — Strategic Priority Weighting",       href: "/s09-strategic-priority-weighting",       icon: Globe },
      { title: "S10 — Strategic Focus Areas",              href: "/s10-strategic-focus-areas",         icon: RefreshCw },
      { title: "S11 — Market Trend Response Tracker",      href: "/s11-market-trend-response-tracker",          icon: Waves },
      { title: "S12 — Long-Term Strategic Outlook",        href: "/s12-strategic-horizon",       icon: Compass },
    ],
  },
  /* ── R-SERIES ───────────────────────────────────────────── */
  {
    label: "R-Series — Cadence Intelligence",
    badge: "R01–R30",
    icon: Activity,
    modules: [
      { title: "R01 — Cadence Mapping",                    href: "/r01-cadence-mapping",         icon: MapPin },
      { title: "R02 — Pace of Execution",                  href: "/r02-pace-of-execution",        icon: Zap },
      { title: "R03 — Cadence Drift Alert",                href: "/r03-cadence-drift-alert",           icon: AlertTriangle },
      { title: "R04 — Cadence Stability Score",            href: "/r04-cadence-stability-score",       icon: Anchor },
      { title: "R05 — Workload Balance Monitor",           href: "/r05-workload-balance-monitor",         icon: Scale },
      { title: "R06 — Cross-Team Cadence Fit",             href: "/r06-cross-team-cadence-fit",         icon: Music2 },
      { title: "R07 — Cadence Consistency Check",          href: "/r07-cadence-consistency-check",       icon: Link2 },
      { title: "R08 — Cadence Integration Across Teams",   href: "/r08-cadence-integration",     icon: GitMerge },
      { title: "R09 — Strategy-to-Execution Alignment",    href: "/r09-strategy-to-execution-alignment",       icon: Compass },
      { title: "R10 — Multi-Team Cadence Sync",            href: "/r10-multi-team-cadence-sync",     icon: Crosshair },
      { title: "R11 — Real-Time Cadence Sync",             href: "/r11-real-time-cadence-sync", icon: RefreshCw },
      { title: "R12 — Operational Flow Tracker",           href: "/r12-operational-flow-tracker",            icon: Wind },
      { title: "R13 — Team Cadence Engagement Score",      href: "/r13-team-cadence-engagement-score",       icon: Waves },
      { title: "R14 — Real-Time Cadence Pulse",            href: "/r14-real-time-cadence-pulse",           icon: Heart },
      { title: "R15 — Organisational Cadence Profile",     href: "/r15-organisational-cadence-profile",       icon: Fingerprint },
      { title: "R16 — Cadence Pattern Report",             href: "/r16-cadence-pattern-report",        icon: Users },
      { title: "R17 — Core Cadence Drivers",               href: "/r17-core-cadence-drivers",         icon: Sparkles },
      { title: "R18 — Cultural Cadence Fit",               href: "/r18-cultural-cadence-fit",          icon: Zap },
      { title: "R19 — Cadence Impact Area",                href: "/r19-cadence-impact-area",           icon: Globe },
      { title: "R20 — Department Cadence View",            href: "/r20-department-cadence-view",          icon: Layout },
      { title: "R21 — Business Unit Cadence View",         href: "/r21-business-unit-cadence-view",           icon: Globe },
      { title: "R22 — Enterprise-Wide Cadence View",       href: "/r22-enterprise-wide-cadence-view",        icon: Star },
      { title: "R23 — Long-Term Cadence Trends",           href: "/r23-long-term-cadence-trends",        icon: Zap },
      { title: "R24 — Historical Cadence Tracking",        href: "/r24-historical-cadence-tracking",       icon: Link2 },
      { title: "R25 — Root Cause of Cadence Issues",       href: "/r25-root-cause-of-cadence-issues",          icon: Sparkles },
      { title: "R26 — Cadence Data Sources",               href: "/r26-cadence-data-sources",          icon: Layers },
      { title: "R27 — Peak Performance Cadence",           href: "/r27-peak-performance-cadence",            icon: TrendingUp },
      { title: "R28 — Cadence Governance Console",         href: "/r28-cadence-governance-console",       icon: Shield },
      { title: "R29 — Executive Cadence Report",           href: "/r29-executive-cadence-report",           icon: Award },
      { title: "R30 — Enterprise Cadence Overview",        href: "/r30-enterprise-cadence-overview",        icon: Globe },
    ],
  },
  /* ── Q-SERIES ───────────────────────────────────────────── */
  {
    label: "Q-Series — Decision Intelligence",
    badge: "Q01–Q100",
    icon: Cpu,
    modules: [
      /* Q01–Q10 */
      { title: "Q01 — Decision Landscape Mapping",         href: "/q01-decision-landscape-mapping",           icon: Globe },
      { title: "Q02 — Current Decision Status",            href: "/q02-current-decision-status",           icon: Layers },
      { title: "Q03 — Decision Path Simulator",            href: "/q03-decision-path-simulator",            icon: Navigation },
      { title: "Q04 — Outcome Probability Engine",         href: "/q04-outcome-probability",     icon: Shuffle },
      { title: "Q05 — Decision Timing Optimizer",          href: "/q05-decision-timing-diagnostic",          icon: Clock },
      { title: "Q06 — Conflicting Priorities Detector",    href: "/q06-conflicting-priorities-detector",    icon: Waves },
      { title: "Q07 — Decision Consistency Check",         href: "/q07-decision-consistency-check",       icon: Link2 },
      { title: "Q08 — Decision Finalization Engine",       href: "/q08-decision-finalization",        icon: Zap },
      { title: "Q09 — Option Selection Assistant",         href: "/q09-option-selection-assistant",       icon: Crosshair },
      { title: "Q10 — Multi-Factor Decision View",         href: "/q10-multi-factor-decision-view",       icon: Cpu },
      /* Q11–Q20 */
      { title: "Q11 — Scenario Reality Check",             href: "/q11-scenario-reality-check",         icon: Star },
      { title: "Q12 — Full Scenario Explorer",             href: "/q12-full-scenario-explorer",        icon: Globe },
      { title: "Q13 — Root Cause Tracer",                  href: "/q13-root-cause-tracer",          icon: Sparkles },
      { title: "Q14 — Data Source Validator",              href: "/q14-data-source-validator",          icon: Anchor },
      { title: "Q15 — Early Warning Signals",              href: "/q15-early-warning-signals",          icon: Activity },
      { title: "Q16 — Decision Recurrence Tracker",        href: "/q16-decision-recurrence-tracker",       icon: Music2 },
      { title: "Q17 — Stakeholder Alignment Score",        href: "/q17-stakeholder-alignment-score",       icon: Waves },
      { title: "Q18 — Cross-Team Consistency Check",       href: "/q18-cross-team-consistency-check",        icon: Music2 },
      { title: "Q19 — Sentiment-Adjusted Scoring",         href: "/q19-sentiment-adjusted-assessment",        icon: Music2 },
      { title: "Q20 — Context Insight Layer",              href: "/q20-context-insight-layer",         icon: Layers },
      /* Q21–Q30 */
      { title: "Q21 — Decision Framework Builder",         href: "/q21-decision-framework-builder",            icon: Layout },
      { title: "Q22 — Decision Structure Mapper",          href: "/q22-decision-structure-mapper",       icon: GitBranch },
      { title: "Q23 — Decision Architecture Console",      href: "/q23-decision-architecture-console",    icon: Settings2 },
      { title: "Q24 — Decision Model Designer",            href: "/q24-decision-model-diagnostic",          icon: Settings2 },
      { title: "Q25 — Recurring Pattern Detector",         href: "/q25-recurring-pattern-detector",         icon: AlignJustify },
      { title: "Q26 — Decision Signature Report",          href: "/q26-decision-signature-report",       icon: Fingerprint },
      { title: "Q27 — Decision-Maker Profile",             href: "/q27-decision-maker-profile",        icon: Users },
      { title: "Q28 — Stakeholder Persona Mapping",        href: "/q28-stakeholder-persona-mapping",         icon: Heart },
      { title: "Q29 — Decision Role Assignment",           href: "/q29-decision-role-assignment",            icon: Briefcase },
      { title: "Q30 — Decision Function Library",          href: "/q30-decision-function-library",        icon: Cpu },
      /* Q31–Q40 */
      { title: "Q31 — Decision Capacity Planner",          href: "/q31-decision-capacity-planner",        icon: BarChart3 },
      { title: "Q32 — Team Decision Capability Score",     href: "/q32-team-decision-capability-score",      icon: Award },
      { title: "Q33 — Decision-Making Skill Score",        href: "/q33-decision-making-skill-score",           icon: FlaskConical },
      { title: "Q34 — Best-Practice Technique Library",    href: "/q34-best-practice-technique-library",       icon: Settings2 },
      { title: "Q35 — Decision Methodology Selector",      href: "/q35-decision-methodology-selector",          icon: Workflow },
      { title: "Q36 — Decision Process Tracker",           href: "/q36-decision-process-tracker",         icon: RefreshCw },
      { title: "Q37 — Decision Workflow Automation",       href: "/q37-decision-workflow-automation",        icon: GitMerge },
      { title: "Q38 — Enterprise Decision System",         href: "/q38-enterprise-decision-system",          icon: Server },
      { title: "Q39 — Cross-Functional Decision Network",  href: "/q39-cross-functional-decision-network",         icon: Share2 },
      { title: "Q40 — Decision Ecosystem Overview",        href: "/q40-decision-ecosystem-overview",       icon: Globe },
      /* Q41–Q50 */
      { title: "Q41 — Decision Intelligence Summary",      href: "/q41-decision-intelligence-summary",    icon: BarChart3 },
      { title: "Q42 — Organizational Insight Index",       href: "/q42-organizational-insight-index",   icon: Eye },
      { title: "Q43 — Risk Visibility Monitor",            href: "/q43-risk-visibility-monitor",       icon: Radar },
      { title: "Q44 — Decision Clarity Score",             href: "/q44-decision-clarity-score",         icon: Search },
      { title: "Q45 — Strategic Insight Generator",        href: "/q45-strategic-insight-generator",         icon: Lightbulb },
      { title: "Q46 — Predictive Foresight Engine",        href: "/q46-predictive-foresight",       icon: Navigation },
      { title: "Q47 — Long-Range Vision Planner",          href: "/q47-long-range-vision-planner",          icon: Eye },
      { title: "Q48 — Multi-Stakeholder Perspective View", href: "/q48-multi-stakeholder-perspective-view",     icon: MapPin },
      { title: "Q49 — Decision Rationale Explainer",       href: "/q49-decision-rationale-explainer",   icon: GraduationCap },
      { title: "Q50 — Decision Mastery Benchmark",         href: "/q50-decision-mastery-benchmark",         icon: Award },
      /* Q51–Q60 */
      { title: "Q51 — Decision Influence Score",           href: "/q51-decision-influence-score",           icon: Zap },
      { title: "Q52 — Decision Impact Strength",           href: "/q52-decision-impact-strength",           icon: TrendingUp },
      { title: "Q53 — Team Capacity & Workload Monitor",   href: "/q53-team-capacity-and-workload-monitor",          icon: Activity },
      { title: "Q54 — Decision Momentum Tracker",          href: "/q54-decision-momentum-tracker",        icon: ArrowUpRight },
      { title: "Q55 — Decision Speed Index",               href: "/q55-decision-speed-index",        icon: Zap },
      { title: "Q56 — Decision Acceleration Planner",      href: "/q56-decision-acceleration-planner",    icon: TrendingUp },
      { title: "Q57 — Business Impact Estimator",          href: "/q57-business-impact-estimator",          icon: AlertTriangle },
      { title: "Q58 — Impact Magnitude Report",            href: "/q58-impact-magnitude-report",       icon: BarChart3 },
      { title: "Q59 — Outcome Range Forecast",             href: "/q59-outcome-range-assessment",       icon: Waves },
      { title: "Q60 — Decision Urgency Index",             href: "/q60-decision-urgency-index",       icon: Gauge },
      /* Q61–Q70 */
      { title: "Q61 — Decision Scope Mapper",              href: "/q61-decision-scope-mapper",           icon: Globe },
      { title: "Q62 — Domain-Specific Decision View",      href: "/q62-domain-specific-decision-view",          icon: Map },
      { title: "Q63 — Market Territory Analysis",          href: "/q63-market-territory-analysis",       icon: MapPin },
      { title: "Q64 — Business Unit Decision Overview",    href: "/q64-business-unit-decision-overview",           icon: Globe },
      { title: "Q65 — Enterprise-Wide Decision Map",       href: "/q65-enterprise-wide-decision-map",         icon: Star },
      { title: "Q66 — Portfolio/Group Decision View",      href: "/q66-portfolio-group-decision-view",          icon: Star },
      { title: "Q67 — Global Decision Overview",           href: "/q67-global-decision-overview",          icon: Globe },
      { title: "Q68 — Long-Term Scenario Planner",         href: "/q68-long-term-scenario-planner",        icon: Zap },
      { title: "Q69 — Continuous Decision Tracking",       href: "/q69-decision-consistency-diagnostic",       icon: Link2 },
      { title: "Q70 — Legacy Decision Archive",            href: "/q70-legacy-decision-archive",        icon: Anchor },
      /* Q71–Q80 */
      { title: "Q71 — Decision Timeline",                  href: "/q71-decision-timeline",            icon: Clock },
      { title: "Q72 — Point-in-Time Snapshot",             href: "/q72-point-in-time-snapshot",          icon: Clock },
      { title: "Q73 — Decision Sequence Tracker",          href: "/q73-decision-sequence-tracker",        icon: AlignJustify },
      { title: "Q74 — Decision Duration Analysis",         href: "/q74-decision-duration-analysis",        icon: Clock },
      { title: "Q75 — Recurring Decision Cycles",          href: "/q75-recurring-decision-cycles",           icon: RefreshCw },
      { title: "Q76 — Long-Term Commitment Tracker",       href: "/q76-long-term-commitment-tracker",      icon: Anchor },
      { title: "Q77 — Breakthrough Decision Alerts",       href: "/q77-breakthrough-decision-alerts",   icon: ArrowUpRight },
      { title: "Q78 — Cross-Team Decision Convergence",    href: "/q78-cross-team-decision-convergence",     icon: GitMerge },
      { title: "Q79 — Critical Decision Point Alert",      href: "/q79-critical-decision-point-alert",     icon: Cpu },
      { title: "Q80 — Decision Model Evolution Tracker",   href: "/q80-decision-model-evolution-tracker",       icon: TrendingUp },
      /* Q81–Q90 */
      { title: "Q81 — Organisational Self-Assessment",     href: "/q81-organisational-self-assessment",            icon: Fingerprint },
      { title: "Q82 — Core Decision Principles",           href: "/q82-core-decision-principles",            icon: Anchor },
      { title: "Q83 — Decision Culture Profile",           href: "/q83-decision-culture-profile",         icon: Sparkles },
      { title: "Q84 — Company Values Alignment",           href: "/q84-company-values-alignment",          icon: Zap },
      { title: "Q85 — Organisational Health Check",        href: "/q85-organisational-health-check",           icon: Star },
      { title: "Q86 — Business Continuity Status",         href: "/q86-business-continuity-status",       icon: Globe },
      { title: "Q87 — Independent Decision Authority",     href: "/q87-independent-decision-authority", icon: Star },
      { title: "Q88 — Enterprise Decision Insight",        href: "/q88-enterprise-decision-insight", icon: Eye },
      { title: "Q89 — Organisational Identity Report",     href: "/q89-organisational-identity-report",      icon: Fingerprint },
      { title: "Q90 — Autonomous Decision Capability",     href: "/q90-autonomous-decision-capability",           icon: Star },
      /* Q91–Q100 */
      { title: "Q91 — Governance Foundation",              href: "/q91-governance-foundation",    icon: Anchor },
      { title: "Q92 — Partnership Agreement Tracker",      href: "/q92-partnership-agreement-tracker",      icon: HeartHandshake },
      { title: "Q93 — Enterprise Charter & Bylaws",        href: "/q93-enterprise-charter-and-bylaws",       icon: ClipboardList },
      { title: "Q94 — Public Commitments Tracker",         href: "/q94-public-commitments-tracker",   icon: ClipboardCheck },
      { title: "Q95 — Executive Mandate Tracker",          href: "/q95-executive-mandate-tracker",       icon: Landmark },
      { title: "Q96 — Decision Protocol Library",          href: "/q96-decision-protocol-library",      icon: Settings2 },
      { title: "Q97 — Compliance & Policy Rules",          href: "/q97-compliance-and-policy-rules",           icon: Scale },
      { title: "Q98 — Decision Authority Matrix",          href: "/q98-decision-authority-matrix",     icon: Shield },
      { title: "Q99 — Enterprise Governance Engine",       href: "/q99-enterprise-governance",             icon: Star },
      { title: "Q100 — Executive Sign-Off & Certification",href: "/q100-executive-sign-off-and-certification",         icon: Award },
    ],
  },
  /* ── X-SERIES ───────────────────────────────────────────── */
  {
    label: "X-Series — Protection Intelligence",
    badge: "X01–X07",
    icon: ShieldAlert,
    modules: [
      { title: "X01 — Enterprise Protection",     href: "/x01-protection",   icon: ShieldAlert },
      { title: "X02 — Security Intelligence",     href: "/x02-security",     icon: Lock },
      { title: "X03 — Governance Intelligence",   href: "/x03-governance",   icon: Landmark },
      { title: "X04 — Compliance Intelligence",   href: "/x04-compliance",   icon: ClipboardCheck },
      { title: "X05 — Ethics Intelligence",       href: "/x05-ethics",       icon: Heart },
      { title: "X06 — Resilience Intelligence",   href: "/x06-resilience",   icon: Server },
      { title: "X07 — Continuity Intelligence",   href: "/x07-continuity",   icon: Repeat },
    ],
  },
  /* ── Z-SERIES ───────────────────────────────────────────── */
  {
    label: "Z-Series — Transformation Intelligence",
    badge: "Z01–Z15",
    icon: Globe,
    modules: [
      { title: "Z01 — Breakthrough Opportunity Mapping",      href: "/z01-breakthrough-opportunity-mapping",        icon: Globe },
      { title: "Z02 — Pace of Transformation",                href: "/z02-pace-of-transformation",       icon: Zap },
      { title: "Z03 — Transformation Drift Alert",            href: "/z03-transformation-drift-alert",          icon: AlertTriangle },
      { title: "Z04 — Transformation Stability Score",        href: "/z04-transformation-stability-score",      icon: Anchor },
      { title: "Z05 — Transformation Alignment Across Teams", href: "/z05-transformation-alignment-across-teams",    icon: GitMerge },
      { title: "Z06 — Transformation Progress Tracker",       href: "/z06-transformation-progress-tracker",           icon: Wind },
      { title: "Z07 — Transformation Identity Report",        href: "/z07-transformation-identity-report",       icon: Fingerprint },
      { title: "Z08 — Enterprise-Wide Intelligence Summary",  href: "/z08-enterprise-wide-intelligence-summary",        icon: Globe },
      { title: "Z09 — Enterprise Consistency Check",          href: "/z09-enterprise-consistency-check",           icon: Link2 },
      { title: "Z10 — Enterprise-Wide Alignment",             href: "/z10-enterprise-wide-alignment",         icon: GitMerge },
      { title: "Z11 — Enterprise Flow Tracker",               href: "/z11-enterprise-flow-tracker",                icon: Wind },
      { title: "Z12 — Enterprise Renewal Cycle",              href: "/z12-enterprise-renewal-cycle",             icon: RefreshCw },
      { title: "Z13 — Enterprise Insight Index",              href: "/z13-enterprise-insight-index",   icon: Cpu },
      { title: "Z14 — Organizational Insight Consistency",    href: "/z14-organizational-insight-consistency",    icon: Eye },
      { title: "Z15 — Organizational Insight Tracker",        href: "/z15-organizational-insight-tracker",         icon: Waves },
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
  /* ── F-SERIES ───────────────────────────────────────────── */
  {
    label: "F-Series — Financial Intelligence (LAMID FINANCE)",
    badge: "F01–F07",
    icon: Landmark,
    modules: [
      { title: "F01 — Financial Visibility Engine",    href: "/f01-financial-visibility",  icon: BarChart3 },
      { title: "F02 — Budgeting & Forecasting Engine", href: "/f02-budgeting-forecasting", icon: CalendarDays },
      { title: "F03 — Financial KPI Linkage Diagnostic",           href: "/f03-financial-kpi",         icon: TrendingUp },
      { title: "F04 — Cost Optimization Diagnostic",       href: "/f04-cost-optimization",     icon: TrendingDown },
      { title: "F05 — Enterprise Value Engine",        href: "/f05-enterprise-value",      icon: Star },
      { title: "F06 — Financial Governance Engine",    href: "/f06-financial-governance",  icon: ShieldAlert },
      { title: "F07 — CFO Transformation Engine",      href: "/f07-cfo-transformation",    icon: Briefcase },
    ],
  },
  /* ── OPERATING MODEL & PLATFORM ───────────────────────────────── */
  {
    label: "Enterprise Operating Model",
    badge: "Flagship",
    icon: Star,
    modules: [
      { title: "Operating Model Enterprise Console", href: "/operating-model", icon: Star },
    ],
  },
  {
    label: "Platform Intelligence",
    badge: "Dashboards",
    icon: BarChart3,
    modules: [
      { title: "Decision Intelligence (Q01)",   href: "/q01-decision-landscape-mapping",       icon: Cpu },
      { title: "Cadence Intelligence",          href: "/cadence-intelligence",     icon: Activity },
      { title: "Operations Intelligence",       href: "/operations-intelligence", icon: Settings2 },
    ],
  },
];

export default function IntelligenceHubPage() {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setCollapsed(p => ({ ...p, [i]: !p[i] }));

  const totalModules = SECTIONS.reduce((acc, s) => acc + s.modules.length, 0);

  return (
    <DashboardTierGate pillar="Intelligence Hub" backHref="/" backLabel="Back to Home">
      <main className="lamidone-section min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div {...fadeUp(0)} className="mb-12">
            <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">LAMID ONE</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Intelligence Hub</h1>
            <p className="text-gray-500 dark:text-white/45 text-sm max-w-xl mb-4">
              Every intelligence module in the LAMID ONE ecosystem — {totalModules} engines across {SECTIONS.length} series. One entry point.
            </p>
            <div className="flex flex-wrap gap-2">
              {SECTIONS.map(s => (
                <span key={s.badge} className="text-[9px] font-bold px-2 py-1 rounded-full border border-[#2563EB]/20 text-[#2563EB] bg-[#2563EB]/6">{s.badge}</span>
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
                    <section.icon className="w-4 h-4 text-[#2563EB] shrink-0" strokeWidth={2.2} />
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/40 flex-1 text-left group-hover:text-gray-700 dark:group-hover:text-white/60 transition-colors">
                      {section.label}
                    </p>
                    <span className="text-[9px] font-bold text-[#2563EB] bg-[#2563EB]/10 px-1.5 py-0.5 rounded-full">
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
                          className="lamidone-card border rounded-xl p-3 hover:border-[#2563EB]/30 transition-colors group flex flex-col gap-1.5"
                        >
                          <mod.icon className="w-3.5 h-3.5 text-[#2563EB]" strokeWidth={2.2} />
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

        {/* Registry-derived browser — always complete, always searchable */}
        <ModuleBrowser />
      </main>
    </DashboardTierGate>
  );
}
