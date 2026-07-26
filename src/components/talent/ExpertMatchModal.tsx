"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Star, Loader2, User, ArrowRight, BadgeCheck } from "lucide-react";

interface Expert {
  id:         string;
  name:       string;
  title:      string;
  skills:     string[];
  rating:     number;
  completedProjects: number;
  score?:     number;
  avatar?:    string;
  location?:  string;
}

interface Props {
  open:     boolean;
  onClose:  () => void;
}

export default function ExpertMatchModal({ open, onClose }: Props) {
  const [query,    setQuery]    = useState("");
  const [experts,  setExperts]  = useState<Expert[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [fetched,  setFetched]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Focus input when modal opens */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  /* Auto-fetch top consultants on open (generic match) */
  useEffect(() => {
    if (!open || fetched) return;
    fetchExperts("consulting strategy management");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const fetchExperts = async (need: string) => {
    setLoading(true);
    try {
      const res  = await fetch("/api/ai/match", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          title:       need || "General Consulting",
          description: need || "Looking for expert consultants",
          skills:      need.split(" ").slice(0, 3),
        }),
      });
      const data = await res.json();

      if (res.ok && data.matches?.length) {
        const mapped: Expert[] = data.matches.slice(0, 8).map((m: any) => ({
          id:                m.consultant?.id ?? m.consultant?._id ?? Math.random().toString(),
          name:              m.consultant?.name ?? "Consultant",
          title:             m.consultant?.title ?? "Expert Consultant",
          skills:            m.consultant?.skills ?? [],
          rating:            m.consultant?.rating ?? 4.8,
          completedProjects: m.consultant?.completedProjects ?? 0,
          score:             m.score?.total,
          location:          m.consultant?.location,
        }));
        setExperts(mapped);
      } else {
        /* Graceful fallback — guide user to sign in or browse */
        setExperts([]);
      }
    } catch {
      setExperts([]);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) { setFetched(false); fetchExperts(query.trim()); }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1,  scale: 1,    y: 0 }}
            exit={{    opacity: 0,  scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: [0.33, 1, 0.68, 1] }}
            className="fixed inset-x-4 top-[5vh] bottom-[5vh] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[560px] sm:top-[8vh] sm:bottom-auto sm:max-h-[84vh] z-50 flex flex-col lamidone-section border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.4)]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-white/8 flex-shrink-0">
              <div className="flex-1 min-w-0">
                <p className="lamidone-gradient-text text-[10px] tracking-[0.3em] uppercase font-bold mb-0.5">LAMID CORE</p>
                <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight">AI Expert Match</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:border-[#2563EB]/30 transition-all"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <form onSubmit={onSearch} className="px-6 pt-5 pb-4 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Describe what you need — e.g. 'HR transformation strategy'"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.04] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#2563EB]/50 focus:ring-1 focus:ring-[#2563EB]/20 transition-colors"
                />
                {query && (
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#2563EB] hover:underline">
                    Search
                  </button>
                )}
              </div>
              <p className="text-[10px] text-gray-400 dark:text-white/30 mt-2 px-1">Our AI scores consultants across 40+ factors to find your ideal match.</p>
            </form>

            {/* Results */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3 [&::-webkit-scrollbar]:hidden">
              {loading && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="w-6 h-6 text-[#2563EB] animate-spin" />
                  <p className="text-sm text-gray-500 dark:text-white/40">Matching experts to your needs…</p>
                </div>
              )}

              {!loading && experts.length === 0 && fetched && (
                <div className="flex flex-col items-center justify-center py-14 gap-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-white mb-1">Sign in to unlock expert matching</p>
                    <p className="text-xs text-gray-400 dark:text-white/35 max-w-xs">Create a free account to access our AI-powered matching engine and connect with vetted consultants.</p>
                  </div>
                  <div className="flex gap-2">
                    <a href="/signup" className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-[0_0_14px_rgba(37,99,235,0.3)]">Create Account</a>
                    <a href="/jobs"   className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#2563EB]/25 text-[#2563EB] hover:bg-[#2563EB]/8 transition-colors">Browse Experts</a>
                  </div>
                </div>
              )}

              {!loading && experts.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="lamidone-card border rounded-2xl p-4 flex items-start gap-3 hover:border-[#2563EB]/25 transition-colors group"
                >
                  {/* Avatar */}
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/12 border border-[#2563EB]/20">
                    {exp.avatar
                      ? <img src={exp.avatar} alt={exp.name} className="h-full w-full rounded-xl object-cover" />
                      : <span className="text-xs font-bold text-[#2563EB]">{exp.name.slice(0, 2).toUpperCase()}</span>
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{exp.name}</p>
                      <BadgeCheck className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-white/45 truncate mb-2">{exp.title}</p>
                    <div className="flex flex-wrap gap-1">
                      {exp.skills.slice(0, 3).map(s => (
                        <span key={s} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-white/6 text-gray-600 dark:text-white/50">{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {exp.score && (
                      <span className="text-[9px] font-bold text-[#2563EB] bg-[#2563EB]/10 px-1.5 py-0.5 rounded-full">
                        {Math.round(exp.score)}% match
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-semibold text-gray-700 dark:text-white/70">{exp.rating.toFixed(1)}</span>
                    </div>
                    <a href={`/jobs`} className="flex items-center gap-0.5 text-[9px] font-semibold text-[#2563EB] hover:underline">
                      View <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            {!loading && experts.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 dark:border-white/8 flex items-center justify-between flex-shrink-0">
                <p className="text-[10px] text-gray-400 dark:text-white/30">{experts.length} experts matched</p>
                <a href="/jobs" className="flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline">
                  Browse all consultants <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
