"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ── Tabs ── */
const TABS = [
  { id: "consultants", label: "Consultants", icon: "◈" },
  { id: "projects",    label: "Projects",    icon: "⬡" },
  { id: "jobs",        label: "Jobs",        icon: "⬟" },
  { id: "prototypes",  label: "Prototypes",  icon: "▣" },
];

/* ── Tag colour map by sector/skill ── */
function tagCls(tag) {
  const k = (tag || "").toLowerCase();
  if (k.includes("strateg") || k.includes("plan"))  return "bg-blue-500/15 text-blue-400 border-blue-500/25";
  if (k.includes("financ")  || k.includes("cfo"))   return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
  if (k.includes("tech")    || k.includes("ai"))     return "bg-violet-500/15 text-violet-400 border-violet-500/25";
  if (k.includes("legal")   || k.includes("comply")) return "bg-amber-500/15 text-amber-400 border-amber-500/25";
  if (k.includes("talent")  || k.includes("hr"))     return "bg-orange-500/15 text-orange-400 border-orange-500/25";
  return "bg-[#C12129]/12 text-[#C12129] border-[#C12129]/25";
}

/* ── Stars display ── */
function Stars({ count, onSet }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <button key={s} type="button"
          onClick={onSet ? () => onSet(s) : undefined}
          className={`text-base transition-transform ${onSet ? "cursor-pointer hover:scale-125" : "cursor-default"}
            ${s <= count ? "aivora-gradient-text" : "text-white/15 dark:text-white/15 text-gray-200"}`}>
          ★
        </button>
      ))}
    </div>
  );
}

/* ── Generic marketplace card ── */
function Card({ item, type, onClick }) {
  const [hov, setHov] = useState(false);
  const name  = item.name || item.title || item.jobTitle || "Untitled";
  const sub   = item.role || item.company || item.category || "";
  const desc  = item.bio  || item.description || item.summary || "";
  const tags  = item.skills || item.tags || item.sectors || [];

  return (
    <motion.div
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      onClick={() => onClick(item)}
      whileHover={{ y: -5, boxShadow: "0 16px 40px rgba(193,33,41,0.18)" }}
      whileTap={{ scale: 0.97 }}
      className="relative aivora-card border rounded-2xl p-5 cursor-pointer flex flex-col gap-3 overflow-hidden"
      style={{ borderColor: hov ? "rgba(193,33,41,0.45)" : undefined }}
    >
      {/* Top accent sweep */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
        style={{ background: "linear-gradient(to right, #C12129, transparent)" }}
        animate={{ scaleX: hov ? 1 : 0, originX: 0 }} transition={{ duration: 0.25 }}
      />
      {/* Corner glow */}
      <motion.div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-3xl bg-[#C12129] pointer-events-none"
        animate={{ opacity: hov ? 0.1 : 0 }} transition={{ duration: 0.3 }}
      />

      {/* Header row */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-[#C12129]/12 border border-[#C12129]/25 text-base font-bold overflow-hidden">
          {type === "consultants" && item.avatar
            ? <img src={item.avatar} alt={name} className="w-full h-full object-cover" />
            : <span className="aivora-gradient-text">
                {type === "consultants" ? (name[0] || "C") : type === "projects" ? "⬡" : type === "jobs" ? "⬟" : "▣"}
              </span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-1">{name}</h3>
          {sub && <p className="text-[11px] text-gray-500 dark:text-white/40 mt-0.5 line-clamp-1">{sub}</p>}
        </div>
        {item.rating != null && (
          <span className="text-[10px] font-bold aivora-gradient-text shrink-0">
            ★ {parseFloat(item.rating).toFixed(1)}
          </span>
        )}
      </div>

      {/* Description */}
      {desc && (
        <p className="text-[11px] text-gray-500 dark:text-white/40 leading-relaxed line-clamp-2">{desc}</p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {tags.slice(0, 3).map((tag, i) => (
            <span key={i} className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${tagCls(tag)}`}>
              {tag}
            </span>
          ))}
          {tags.length > 3 && <span className="text-[9px] text-gray-400 dark:text-white/25 self-center">+{tags.length - 3}</span>}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] pt-2 border-t border-gray-100 dark:border-white/6">
        {item.hourlyRate  && <span className="aivora-gradient-text font-bold">${item.hourlyRate}/hr</span>}
        {item.budget      && <span className="aivora-gradient-text font-bold">{item.budget}</span>}
        {item.location    && <span className="text-gray-400 dark:text-white/25">{item.location}</span>}
        <motion.span className="aivora-gradient-text font-semibold ml-auto"
          animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : -4 }} transition={{ duration: 0.15 }}>
          View →
        </motion.span>
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
  const href = type === "consultants" ? `/consultant/${item._id || item.id}`
             : type === "projects"    ? `/projects/${item._id || item.id}`
             : `/jobs`;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/88 backdrop-blur-md px-4 py-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#080808] border border-white/8 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(193,33,41,0.2)] max-h-[88vh] overflow-y-auto"
      >
        <div className="h-[3px] bg-gradient-to-r from-[#C12129] via-red-400 to-transparent sticky top-0" />
        <div className="px-7 pt-6 pb-8">

          {/* Header */}
          <div className="flex items-start gap-4 mb-5">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-[#C12129]/12 border border-[#C12129]/25 overflow-hidden text-xl">
              {type === "consultants" && item.avatar
                ? <img src={item.avatar} alt={name} className="w-full h-full object-cover" />
                : <span className="aivora-gradient-text font-bold">
                    {type === "consultants" ? name[0] : type === "projects" ? "⬡" : type === "jobs" ? "⬟" : "▣"}
                  </span>
              }
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white leading-snug">{name}</h2>
              {sub && <p className="text-sm text-white/45 mt-0.5">{sub}</p>}
              {item.rating != null && <Stars count={Math.round(item.rating)} />}
            </div>
            <button type="button" onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/10 text-white/30 hover:text-white hover:border-[#C12129]/40 transition-colors cursor-pointer shrink-0 text-base">
              ✕
            </button>
          </div>

          {/* Stats */}
          {(item.hourlyRate || item.budget || item.matchScore || item.location || item.timeline) && (
            <div className="flex flex-wrap gap-2 mb-5">
              {item.hourlyRate  && <span className="px-3 py-1.5 rounded-xl bg-[#C12129]/10 border border-[#C12129]/25 text-xs aivora-gradient-text font-bold">${item.hourlyRate}/hr</span>}
              {item.budget      && <span className="px-3 py-1.5 rounded-xl bg-[#C12129]/10 border border-[#C12129]/25 text-xs aivora-gradient-text font-bold">{item.budget}</span>}
              {item.matchScore  && <span className="px-3 py-1.5 rounded-xl bg-[#C12129]/10 border border-[#C12129]/25 text-xs aivora-gradient-text font-bold">{item.matchScore}% match</span>}
              {item.location    && <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/8 text-xs text-white/50">{item.location}</span>}
              {item.timeline    && <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/8 text-xs text-white/50">{item.timeline}</span>}
            </div>
          )}

          {/* Description */}
          {desc && (
            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-widest aivora-gradient-text mb-2">About</p>
              <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-widest aivora-gradient-text mb-3">
                {type === "consultants" ? "Skills & Expertise" : "Categories"}
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span key={i} className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${tagCls(tag)}`}>{tag}</span>
                ))}
              </div>
            </div>
          )}

          {item.engagementsCompleted > 0 && (
            <p className="text-xs text-white/30 mb-6">{item.engagementsCompleted} engagements completed</p>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={href}
              className="flex-1 text-center py-3 rounded-xl text-sm font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition-colors shadow-[0_0_18px_rgba(193,33,41,0.4)]">
              {type === "consultants" ? "View Full Profile" : type === "projects" ? "View Project" : "View Openings"}
            </Link>
            <Link href="/signup"
              className="flex-1 text-center py-3 rounded-xl text-sm font-semibold border border-[#C12129]/30 text-[#C12129] hover:bg-[#C12129]/10 transition-colors">
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

/* ── Review Section ── */
function ReviewSection() {
  const [reviews,    setReviews]    = useState([]);
  const [name,       setName]       = useState("");
  const [comment,    setComment]    = useState("");
  const [rating,     setRating]     = useState(5);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState(false);

  useEffect(() => {
    fetch("/api/reviews").then(r => r.json()).then(d => {
      setReviews(Array.isArray(d.reviews) ? d.reviews : Array.isArray(d) ? d : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) { setError("Name and comment are required."); return; }
    setSubmitting(true); setError("");
    try {
      const res  = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment, reviewerName: name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setReviews(prev => [data, ...prev]);
      setName(""); setComment(""); setRating(5);
      setSuccess(true); setTimeout(() => setSuccess(false), 3000);
    } catch { setError("Failed to submit. Please try again."); }
    finally  { setSubmitting(false); }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl text-sm aivora-card border text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-[#C12129]/50 transition-colors";

  return (
    <section className="aivora-section px-4 py-24 border-t border-gray-100 dark:border-white/6">
      <div className="max-w-4xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
          <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">Client Voices</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-snug">
            What Leaders Say After Working with AIVORA
          </h2>
          <p className="text-gray-500 dark:text-white/45 text-sm mt-3 max-w-md mx-auto leading-relaxed">
            Real outcomes. Verified engagements. No guesswork.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Submit form */}
          <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="aivora-card border rounded-2xl p-7">
              <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-5">
                Share Your Experience
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40 block mb-1.5">Your Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required
                    className={inputCls} placeholder="e.g. Sarah O., COO" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40 block mb-1.5">Rating</label>
                  <Stars count={rating} onSet={setRating} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40 block mb-1.5">Your Review</label>
                  <textarea value={comment} onChange={e => setComment(e.target.value)} required rows={4}
                    className={inputCls + " resize-none"}
                    placeholder="What was the outcome? How did AIVORA change how your organization works?" />
                </div>
                {error   && <p className="text-xs text-red-400">{error}</p>}
                {success && <p className="text-xs text-emerald-400">Thank you — your review has been published.</p>}
                <motion.button type="submit" disabled={submitting}
                  whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(193,33,41,0.5)" }} whileTap={{ scale: 0.97 }}
                  className="py-3 rounded-xl text-sm font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] disabled:opacity-50 transition-colors cursor-pointer">
                  {submitting ? "Publishing…" : "Publish Review"}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Reviews list */}
          <div className="flex flex-col gap-4 max-h-[560px] overflow-y-auto pr-1 custom-scrollbar">
            {loading ? (
              [1,2,3].map(i => (
                <div key={i} className="aivora-card border rounded-2xl p-5 animate-pulse space-y-3">
                  <div className="flex gap-3"><div className="w-9 h-9 rounded-full bg-white/8 shrink-0" /><div className="flex-1 space-y-2"><div className="h-3 bg-white/8 rounded w-1/2" /><div className="h-2 bg-white/5 rounded w-1/4" /></div></div>
                  <div className="h-2 bg-white/5 rounded" /><div className="h-2 bg-white/5 rounded w-3/4" />
                </div>
              ))
            ) : reviews.length === 0 ? (
              <div className="aivora-card border rounded-2xl p-10 text-center">
                <p className="text-gray-500 dark:text-white/35 text-sm">No reviews yet.</p>
                <p className="text-gray-400 dark:text-white/20 text-xs mt-1">Be the first to share your experience.</p>
              </div>
            ) : (
              reviews.map((review, i) => (
                <motion.div key={review.id || review._id || i}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                  className="aivora-card border rounded-2xl p-5"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-[#C12129]/12 border border-[#C12129]/25 flex items-center justify-center shrink-0 text-sm font-bold aivora-gradient-text">
                      {(review.reviewerName || review.name || "A")[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                        {review.reviewerName || review.name || "Anonymous"}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Stars count={review.rating || 5} />
                        {review.createdAt && (
                          <span className="text-[10px] text-gray-400 dark:text-white/25">
                            {new Date(review.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-white/55 leading-relaxed italic">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════ MAIN PAGE ════ */
export default function MarketplacePage() {
  const [activeTab,  setActiveTab]  = useState("consultants");
  const [items,      setItems]      = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [search,     setSearch]     = useState("");
  const [activeTag,  setActiveTag]  = useState(null);
  const [selected,   setSelected]   = useState(null);

  const fetchItems = useCallback(async (tab) => {
    setLoading(true); setItems([]);
    const map = {
      consultants: "/api/consultants?limit=24",
      projects:    "/api/projects?limit=24",
      jobs:        "/api/recruitment/jobs?limit=24",
      prototypes:  "/api/projects?category=prototype&limit=24",
    };
    try {
      const res  = await fetch(map[tab]);
      const data = await res.json();
      const list = data.consultants || data.projects || data.jobs ||
                   data.data || data.items || (Array.isArray(data) ? data : []);
      setItems(list);
    } catch { setItems([]); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchItems(activeTab); }, [activeTab, fetchItems]);

  const allTags  = [...new Set(items.flatMap(it => it.skills || it.tags || it.sectors || []))].slice(0, 12);
  const filtered = items.filter(it => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || (it.name || it.title || it.jobTitle || "").toLowerCase().includes(q)
      || (it.bio  || it.description || "").toLowerCase().includes(q);
    const matchTag = !activeTag || (it.skills || it.tags || it.sectors || []).includes(activeTag);
    return matchSearch && matchTag;
  });

  return (
    <div className="aivora-section min-h-screen">

      {/* ── Hero / Search ── */}
      <section className="relative px-4 pt-32 pb-10 text-center overflow-hidden">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          <motion.path d="M-60 200 C200 80 400 320 700 160 C950 40 1200 280 1450 150"
            fill="none" stroke="#C12129" strokeWidth="0.6" strokeOpacity="0.07" strokeDasharray="12 20"
            animate={{ strokeDashoffset: [0, -100] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
        </svg>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} className="relative z-10 max-w-2xl mx-auto">
          <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">AIVORA Marketplace</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mb-4">
            <span className="text-gray-900 dark:text-white">Find the Right Expert.</span>{" "}
            <span className="aivora-gradient-text">Instantly.</span>
          </h1>
          <p className="text-gray-500 dark:text-white/50 text-sm mb-8 leading-relaxed">
            AI-matched consultants, live projects, and open opportunities — all in one place.
          </p>
          <div className="relative max-w-xl mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 pointer-events-none">⬡</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search consultants, projects, or skills…"
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm aivora-card border text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:border-[#C12129]/50 transition-colors" />
          </div>
        </motion.div>
      </section>

      {/* ── Tabs ── */}
      <div className="px-4 pb-4">
        <div className="max-w-5xl mx-auto flex items-center gap-2 overflow-x-auto">
          {TABS.map(tab => (
            <motion.button key={tab.id} type="button"
              onClick={() => { setActiveTab(tab.id); setActiveTag(null); setSearch(""); }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap cursor-pointer transition-all duration-200 shrink-0
                ${activeTab === tab.id
                  ? "bg-[#C12129] text-white shadow-[0_0_14px_rgba(193,33,41,0.5)]"
                  : "aivora-card border text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:border-[#C12129]/30"}`}>
              <span>{tab.icon}</span>{tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Tag filters ── */}
      {allTags.length > 0 && (
        <div className="px-4 pb-6">
          <div className="max-w-5xl mx-auto flex items-center gap-2 flex-wrap">
            <span className="text-[10px] aivora-text-muted uppercase tracking-wider shrink-0">Filter:</span>
            <button type="button" onClick={() => setActiveTag(null)}
              className={`text-[10px] font-bold px-3 py-1 rounded-full border cursor-pointer transition-all
                ${!activeTag ? "bg-[#C12129]/12 border-[#C12129]/40 aivora-gradient-text" : "aivora-card border text-gray-500 dark:text-white/40 hover:border-[#C12129]/30"}`}>
              All
            </button>
            {allTags.map(tag => (
              <button key={tag} type="button" onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`text-[10px] font-bold px-3 py-1 rounded-full border cursor-pointer transition-all
                  ${activeTag === tag ? tagCls(tag) : "aivora-card border text-gray-500 dark:text-white/40 hover:border-[#C12129]/30"}`}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Cards ── */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="sk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Skeleton />
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-24">
                <p className="text-4xl mb-4 aivora-gradient-text">◈</p>
                <p className="text-gray-500 dark:text-white/35 text-sm">
                  {search ? `No results for "${search}"` : `No ${activeTab} available yet.`}
                </p>
                {search && (
                  <button type="button" onClick={() => setSearch("")}
                    className="mt-4 text-xs aivora-gradient-text hover:opacity-70 cursor-pointer">
                    Clear search →
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div key={activeTab + activeTag}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((item, i) => (
                  <motion.div key={item._id || item.id || i}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.35 }}>
                    <Card item={item} type={activeTab} onClick={setSelected} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {!loading && filtered.length > 0 && (
            <p className="text-center text-xs aivora-text-muted mt-8">
              {filtered.length} {activeTab}{activeTag ? ` · ${activeTag}` : ""}{search ? ` matching "${search}"` : ""}
            </p>
          )}
        </div>
      </section>

      {/* ── Reviews ── */}
      <ReviewSection />

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selected && <DetailModal key="modal" item={selected} type={activeTab} onClose={() => setSelected(null)} />}
      </AnimatePresence>

    </div>
  );
}
