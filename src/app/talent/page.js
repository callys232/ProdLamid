"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AivoraTestimonials from "@/components/aivora/AivoraTestimonials";

/* ── Tabs — each is a descriptor card ── */
const TABS = [
  { id: "consultants", label: "Consultants", icon: "◈", desc: "Find a vetted expert matched to your challenge." },
  { id: "jobs",        label: "Jobs",        icon: "⬟", desc: "Browse open roles and consulting engagements." },
  { id: "prototypes",  label: "Prototypes",  icon: "▣", desc: "Explore live builds and framework tools." },
];

/* ── 3 Trust cards ── */
const TRUST = [
  {
    icon: "◈",
    title: "Vetted Experts Only",
    body:  "Every expert passes a rigorous 5-stage vetting process with verified credentials.",
  },
  {
    icon: "⬡",
    title: "Transparent Pricing",
    body:  "No hidden fees. See rates upfront and pay only for value delivered.",
  },
  {
    icon: "⬟",
    title: "Quality Guaranteed",
    body:  "Satisfaction guarantee on every engagement. We stand behind our experts.",
  },
];

/* ── 6 Use-case tiles — each links to its associated tool. Free to use; sign-in only required to save/export results. ── */
const USE_CASES = [
  { icon: "▣", title: "Strategy & Growth",       body: "Market entry, competitive analysis, and growth roadmaps.",              href: "/premium/business-diagnostic" },
  { icon: "◈", title: "Compliance & Risk",        body: "Regulatory compliance, risk assessment, and governance frameworks.",    href: "/premium/business-diagnostic" },
  { icon: "⚡", title: "Digital Transformation",  body: "AI adoption, tech modernization, and process automation.",              href: "/premium/business-diagnostic" },
  { icon: "⬟", title: "Talent & Culture",         body: "Leadership development, organizational design, and change management.", href: "/hcd" },
  { icon: "⬡", title: "Innovation Labs",          body: "Product ideation, design sprints, and innovation workshops.",           href: "/premium/proposal-drafter" },
  { icon: "✦", title: "Board Advisory",           body: "Board-ready materials, governance reviews, and fiduciary guidance.",    href: "/premium/proposal-drafter" },
];

/* ── Tag colour by keyword ── */
function tagCls(tag) {
  const k = (tag || "").toLowerCase();
  if (k.includes("strateg") || k.includes("plan"))  return "bg-blue-500/15 text-blue-400 border-blue-500/25";
  if (k.includes("financ")  || k.includes("cfo"))   return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
  if (k.includes("tech")    || k.includes("ai"))     return "bg-violet-500/15 text-violet-400 border-violet-500/25";
  if (k.includes("legal")   || k.includes("comply")) return "bg-amber-500/15 text-amber-400 border-amber-500/25";
  if (k.includes("talent")  || k.includes("hr"))     return "bg-orange-500/15 text-orange-400 border-orange-500/25";
  return "bg-[#C12129]/12 text-[#C12129] border-[#C12129]/25";
}

/* ── Stars ── */
function Stars({ count, onSet }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button" onClick={onSet ? () => onSet(s) : undefined}
          className={`text-base transition-transform ${onSet ? "cursor-pointer hover:scale-125" : "cursor-default"}
            ${s <= count ? "aivora-gradient-text" : "text-white/15 dark:text-white/15 text-gray-200"}`}>
          ★
        </button>
      ))}
    </div>
  );
}

/* ── Marketplace card ── */
function Card({ item, type, onClick }) {
  const [hov, setHov] = useState(false);
  const name = item.name || item.title || item.jobTitle || "Untitled";
  const sub  = item.role || item.company || item.category || "";
  const desc = item.bio  || item.description || item.summary || "";
  const tags = item.skills || item.tags || item.sectors || [];

  return (
    <motion.div onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
      onClick={() => onClick(item)}
      whileHover={{ y: -5, boxShadow: "0 16px 40px rgba(193,33,41,0.18)" }} whileTap={{ scale: 0.97 }}
      className="relative aivora-card border rounded-2xl p-5 cursor-pointer flex flex-col gap-3 overflow-hidden"
      style={{ borderColor: hov ? "rgba(193,33,41,0.45)" : undefined }}>
      <motion.div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
        style={{ background: "linear-gradient(to right, #C12129, transparent)" }}
        animate={{ scaleX: hov ? 1 : 0, originX: 0 }} transition={{ duration: 0.25 }} />
      <motion.div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-3xl bg-[#C12129] pointer-events-none"
        animate={{ opacity: hov ? 0.1 : 0 }} transition={{ duration: 0.3 }} />
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-[#C12129]/12 border border-[#C12129]/25 text-base font-bold overflow-hidden">
          {type === "consultants" && item.avatar
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={item.avatar} alt={name} className="w-full h-full object-cover" />
            : <span className="aivora-gradient-text">
                {type === "consultants" ? (name[0] || "C") : type === "projects" ? "⬡" : type === "jobs" ? "⬟" : "▣"}
              </span>}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-1">{name}</h3>
          {sub && <p className="text-[11px] text-gray-500 dark:text-white/40 mt-0.5 line-clamp-1">{sub}</p>}
        </div>
        {item.rating != null && <span className="text-[10px] font-bold aivora-gradient-text shrink-0">★ {parseFloat(item.rating).toFixed(1)}</span>}
      </div>
      {desc && <p className="text-[11px] text-gray-500 dark:text-white/40 leading-relaxed line-clamp-2">{desc}</p>}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {tags.slice(0, 3).map((tag, i) => <span key={i} className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${tagCls(tag)}`}>{tag}</span>)}
          {tags.length > 3 && <span className="text-[9px] text-gray-400 dark:text-white/25 self-center">+{tags.length - 3}</span>}
        </div>
      )}
      <div className="flex items-center justify-between text-[10px] pt-2 border-t border-gray-100 dark:border-white/6">
        {item.location && <span className="text-gray-400 dark:text-white/25">{item.location}</span>}
        <motion.span className="aivora-gradient-text font-semibold ml-auto"
          animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : -4 }} transition={{ duration: 0.15 }}>View →</motion.span>
      </div>
    </motion.div>
  );
}

/* ── Detail Modal ── */
function DetailModal({ item, type, onClose }) {
  const name = item.name || item.title || item.jobTitle || "Details";
  const desc = item.bio  || item.description || item.summary || "";
  const sub  = item.role || item.company || item.category || "";
  const tags = item.skills || item.tags || item.sectors || [];
  const href = type === "consultants" ? `/consultant/${item._id || item.id}` : type === "projects" ? `/projects/${item._id || item.id}` : `/jobs`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/88 backdrop-blur-md px-4 py-8"
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.93, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }} transition={{ type: "spring", stiffness: 280, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#080808] border border-white/8 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(193,33,41,0.2)] max-h-[88vh] overflow-y-auto">
        <div className="h-[3px] bg-gradient-to-r from-[#C12129] via-red-400 to-transparent sticky top-0" />
        <div className="px-7 pt-6 pb-8">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-[#C12129]/12 border border-[#C12129]/25 overflow-hidden text-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {type === "consultants" && item.avatar ? <img src={item.avatar} alt={name} className="w-full h-full object-cover" />
                : <span className="aivora-gradient-text font-bold">{type === "consultants" ? name[0] : type === "projects" ? "⬡" : type === "jobs" ? "⬟" : "▣"}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white leading-snug">{name}</h2>
              {sub && <p className="text-sm text-white/45 mt-0.5">{sub}</p>}
              {item.rating != null && <Stars count={Math.round(item.rating)} />}
            </div>
            <button type="button" onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/10 text-white/30 hover:text-white hover:border-[#C12129]/40 transition-colors cursor-pointer shrink-0 text-base">✕</button>
          </div>
          {(item.matchScore || item.location) && (
            <div className="flex flex-wrap gap-2 mb-5">
              {item.matchScore  && <span className="px-3 py-1.5 rounded-xl bg-[#C12129]/10 border border-[#C12129]/25 text-xs aivora-gradient-text font-bold">{item.matchScore}% match</span>}
              {item.location    && <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/8 text-xs text-white/50">{item.location}</span>}
            </div>
          )}
          {desc && <><p className="text-[10px] font-bold uppercase tracking-widest aivora-gradient-text mb-2">About</p><p className="text-sm text-white/60 leading-relaxed mb-5">{desc}</p></>}
          {tags.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-widest aivora-gradient-text mb-3">Skills</p>
              <div className="flex flex-wrap gap-2">{tags.map((tag, i) => <span key={i} className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${tagCls(tag)}`}>{tag}</span>)}</div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={href} className="flex-1 text-center py-3 rounded-xl text-sm font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition-colors shadow-[0_0_18px_rgba(193,33,41,0.4)]">
              {type === "consultants" ? "View Full Profile" : "View Details"}
            </Link>
            <Link href="/signup" className="flex-1 text-center py-3 rounded-xl text-sm font-semibold border border-[#C12129]/30 text-[#C12129] hover:bg-[#C12129]/10 transition-colors">
              {type === "consultants" ? "Request Consultation" : "Apply Now"}
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Skeleton ── */
function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1,2,3,4,5,6].map(i => (
        <div key={i} className="aivora-card border rounded-2xl p-5 animate-pulse space-y-3">
          <div className="flex gap-3"><div className="w-11 h-11 rounded-xl bg-white/8" /><div className="flex-1 space-y-2 pt-1"><div className="h-3 bg-white/8 rounded w-3/4" /><div className="h-2 bg-white/5 rounded w-1/2" /></div></div>
          <div className="space-y-1.5"><div className="h-2 bg-white/5 rounded" /><div className="h-2 bg-white/5 rounded w-4/5" /></div>
          <div className="flex gap-1.5"><div className="h-5 w-14 bg-white/6 rounded-full" /><div className="h-5 w-12 bg-white/6 rounded-full" /></div>
        </div>
      ))}
    </div>
  );
}

/* ── Category modal — results grid for a chosen tab ── */
function CategoryModal({ tab, onClose, onSelectItem }) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    setLoading(true); setItems([]);
    const map = { consultants: "/api/consultants?limit=48", jobs: "/api/recruitment/jobs?limit=48", prototypes: "/api/projects?category=prototype&limit=48" };
    fetch(map[tab.id])
      .then(r => r.json())
      .then(d => setItems(d.consultants || d.jobs || d.data || (Array.isArray(d) ? d : [])))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [tab.id]);

  const filtered = items.filter(it => {
    const q = search.toLowerCase();
    return !q || (it.name || it.title || it.jobTitle || "").toLowerCase().includes(q) || (it.bio || it.description || "").toLowerCase().includes(q);
  });

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[999998] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md px-4 pb-0 sm:pb-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#080808] border border-white/8 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col"
        style={{ maxHeight: "88vh" }}
      >
        {/* Top accent */}
        <div className="h-[3px] bg-gradient-to-r from-[#C12129] via-red-400 to-transparent shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-4 border-b border-white/6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C12129]/12 border border-[#C12129]/25 flex items-center justify-center">
              <span className="aivora-gradient-text text-lg">{tab.icon}</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">{tab.label}</h2>
              <p className="text-[11px] text-white/35">{tab.desc}</p>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/10 text-white/30 hover:text-white hover:border-[#C12129]/40 transition-colors cursor-pointer text-base shrink-0">
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-white/6 shrink-0">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 aivora-gradient-text pointer-events-none">⬡</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${tab.label.toLowerCase()}…`}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border border-white/8 text-white placeholder-white/25 focus:outline-none focus:border-[#C12129]/40 transition-colors" />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white/[0.025] border border-white/6 rounded-2xl p-5 animate-pulse space-y-3">
                  <div className="flex gap-3"><div className="w-10 h-10 rounded-xl bg-white/8 shrink-0" /><div className="flex-1 space-y-2 pt-1"><div className="h-3 bg-white/8 rounded w-3/4" /><div className="h-2 bg-white/5 rounded w-1/2" /></div></div>
                  <div className="h-2 bg-white/5 rounded" /><div className="h-2 bg-white/5 rounded w-4/5" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <span className="text-4xl aivora-gradient-text">{tab.icon}</span>
              <p className="text-white/35 text-sm">{search ? `No results for "${search}"` : `No ${tab.label.toLowerCase()} yet.`}</p>
              {search && <button type="button" onClick={() => setSearch("")} className="text-xs aivora-gradient-text cursor-pointer">Clear search →</button>}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((item, i) => (
                <motion.div key={item._id || item.id || i}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.35), duration: 0.3 }}>
                  <Card item={item} type={tab.id} onClick={onSelectItem} />
                </motion.div>
              ))}
            </div>
          )}
          {!loading && filtered.length > 0 && (
            <p className="text-center text-[10px] aivora-text-muted mt-6">
              {filtered.length} {tab.label.toLowerCase()}{search ? ` matching "${search}"` : ""}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay } });

/* ════ MAIN PAGE ════ */
export default function MarketplacePage() {
  const router = useRouter();
  const [openTab,      setOpenTab]      = useState(null);
  const [selected,     setSelected]     = useState(null);
  const [hoveredTrust, setHoveredTrust] = useState(null);
  const [hoveredUC,    setHoveredUC]    = useState(null);

  return (
    <div className="aivora-section min-h-screen">

      {/* ══ HERO ══ */}
      <section className="relative px-4 pt-24 pb-8 text-center overflow-hidden">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          <motion.path d="M-60 200 C200 80 400 320 700 160 C950 40 1200 280 1450 150"
            fill="none" stroke="#C12129" strokeWidth="0.6" strokeOpacity="0.07" strokeDasharray="12 20"
            animate={{ strokeDashoffset: [0, -100] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
        </svg>
        <motion.div {...fadeUp(0)} className="relative z-10 max-w-2xl mx-auto">
          <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">LAMID CORE</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            <span className="text-gray-900 dark:text-white">Find Your Expert.</span>{" "}
            <span className="aivora-gradient-text">Instantly.</span>
          </h1>
          <p className="text-gray-500 dark:text-white/50 text-sm sm:text-base mb-8 leading-relaxed max-w-xl mx-auto">
            Our AI-powered matching engine analyzes your needs and connects you with vetted experts in minutes.
          </p>
          {/* Search lives inside each category modal */}
        </motion.div>
      </section>

      {/* ══ AI MATCHING FEATURE CARD ══ */}
      <section className="px-4 pb-8">
        <motion.div {...fadeUp(0)} className="max-w-4xl mx-auto">
          <div className="aivora-card border rounded-2xl p-8 flex flex-col sm:flex-row items-start gap-8 overflow-hidden relative"
            style={{ borderColor: "rgba(193,33,41,0.2)" }}>
            {/* Red accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C12129] to-transparent" />
            <motion.div className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl bg-[#C12129] pointer-events-none"
              animate={{ opacity: [0.06, 0.12, 0.06] }} transition={{ duration: 4, repeat: Infinity }} />
            {/* Text */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">AI-Powered Expert Matching</h2>
              <p className="text-sm text-gray-500 dark:text-white/55 leading-relaxed mb-5">
                Our proprietary algorithm considers 40+ factors including industry experience, methodology expertise, cultural fit, availability, and past engagement ratings to deliver your ideal match.
              </p>
              <ul className="flex flex-col gap-2.5">
                {["Natural language need description", "Multi-dimensional scoring engine", "Results in under 2 minutes"].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-white/60">
                    <span className="aivora-gradient-text text-base shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* 97% score ring */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 108 108" className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="54" cy="54" r="46" fill="none" stroke="rgba(193,33,41,0.12)" strokeWidth="8" />
                  <motion.circle cx="54" cy="54" r="46" fill="none" stroke="#C12129" strokeWidth="8"
                    strokeLinecap="round" strokeDasharray={289} strokeDashoffset={289 * 0.03}
                    initial={{ strokeDashoffset: 289 }}
                    whileInView={{ strokeDashoffset: 289 * 0.03 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold aivora-gradient-text leading-none">97%</span>
                  <span className="text-[9px] text-gray-400 dark:text-white/35 mt-0.5 tracking-wide">Match Score</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══ 3 TRUST CARDS ══ */}
      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TRUST.map((t, i) => (
            <motion.div key={t.title} {...fadeUp(i * 0.08)}
              onHoverStart={() => setHoveredTrust(i)} onHoverEnd={() => setHoveredTrust(null)}
              whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(193,33,41,0.15)" }}
              className="aivora-card border rounded-2xl p-6"
              style={{ borderColor: hoveredTrust === i ? "rgba(193,33,41,0.4)" : undefined }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-[#C12129]/12 border border-[#C12129]/25">
                <span className="text-base aivora-gradient-text">{t.icon}</span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{t.title}</h3>
              <p className="text-xs text-gray-500 dark:text-white/45 leading-relaxed">{t.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ USE CASES ══ */}
      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <motion.h2 {...fadeUp(0)} className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">
            Use Cases
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {USE_CASES.map((uc, i) => (
              <motion.div key={uc.title} {...fadeUp(i * 0.07)}
                onHoverStart={() => setHoveredUC(i)} onHoverEnd={() => setHoveredUC(null)}
                onClick={() => router.push(uc.href)}
                whileHover={{ y: -4, boxShadow: "0 10px 28px rgba(193,33,41,0.14)" }}
                whileTap={{ scale: 0.98 }}
                className="aivora-card border rounded-2xl p-5 cursor-pointer"
                style={{ borderColor: hoveredUC === i ? "rgba(193,33,41,0.4)" : undefined }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-base aivora-gradient-text">{uc.icon}</span>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{uc.title}</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-white/45 leading-relaxed">{uc.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Subtle CTA strip ── */}
      <section className="px-4 pb-8">
        <motion.div {...fadeUp(0)} className="max-w-4xl mx-auto border-t border-gray-100 dark:border-white/6 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">See the engagement, not just the match.</p>
            <p className="text-xs text-gray-500 dark:text-white/40">Track active engagements, matching, and delivery in one place.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/core-dashboard"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#C12129]/25 text-[#C12129] hover:bg-[#C12129]/8 transition-colors">
              Open Dashboard →
            </Link>
          </div>
        </motion.div>
      </section>

      <AivoraTestimonials pillar="core" />

      {/* ══ TABS — descriptor cards, centered ══ */}
      <div className="px-4 pb-8">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TABS.map(tab => {
            const isActive = openTab?.id === tab.id;
            return (
              <motion.button key={tab.id} type="button"
                onClick={() => setOpenTab(tab)}
                whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(193,33,41,0.2)" }}
                whileTap={{ scale: 0.97 }}
                className={`flex flex-col items-center gap-2 px-5 py-5 rounded-2xl border text-center cursor-pointer transition-all duration-200
                  ${isActive
                    ? "bg-[#C12129]/10 border-[#C12129]/50 shadow-[0_0_18px_rgba(193,33,41,0.25)]"
                    : "aivora-card border hover:border-[#C12129]/30"}`}>
                <span className={`text-2xl ${isActive ? "aivora-gradient-text" : "text-gray-500 dark:text-white/40"}`}>
                  {tab.icon}
                </span>
                <span className={`text-sm font-bold ${isActive ? "aivora-gradient-text" : "text-gray-900 dark:text-white"}`}>
                  {tab.label}
                </span>
                <span className="text-[11px] text-gray-500 dark:text-white/40 leading-snug">
                  {tab.desc}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ══ CATEGORY MODAL ══ */}
      <AnimatePresence>
        {openTab && (
          <CategoryModal
            key="cat-modal"
            tab={openTab}
            onClose={() => { setOpenTab(null); setSelected(null); }}
            onSelectItem={setSelected}
          />
        )}
      </AnimatePresence>

      {/* ══ ITEM DETAIL MODAL ══ */}
      <AnimatePresence>
        {selected && (
          <DetailModal
            key="item-modal"
            item={selected}
            type={openTab?.id || "consultants"}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
