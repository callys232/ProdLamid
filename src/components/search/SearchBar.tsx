"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, FolderOpen, Users } from "lucide-react";
import Link from "next/link";

interface SearchResult {
  type:     "project" | "consultant";
  id:       string;
  title:    string;
  subtitle?: string;
  href:     string;
}

interface Props {
  placeholder?: string;
  searchType?:  "all" | "projects" | "consultants";
  className?:   string;
}

export default function SearchBar({ placeholder = "Search projects or consultants…", searchType = "all", className = "" }: Props) {
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen]       = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!query.trim()) { setResults([]); setOpen(false); return; }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res  = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${searchType}&limit=6`);
        const data = await res.json();
        const out: SearchResult[] = [];

        (data.data?.projects ?? []).forEach((p: any) => out.push({
          type:     "project",
          id:       p._id,
          title:    p.title,
          subtitle: p.category,
          href:     `/projects/${p._id}`,
        }));

        (data.data?.consultants ?? []).forEach((c: any) => {
          const name = c.firstName ? `${c.firstName} ${c.lastName ?? ""}`.trim() : (c.user?.username ?? "Consultant");
          out.push({
            type:     "consultant",
            id:       c._id,
            title:    name,
            subtitle: c.title,
            href:     `/consultant/${c.user?._id ?? c._id}`,
          });
        });

        setResults(out);
        setOpen(out.length > 0);
      } catch { /* silent */ }
      finally { setLoading(false); }
    }, 400);
  }, [query, searchType]);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 transition focus-within:border-[#2563EB]/40">
        {loading ? <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-gray-500" /> : <Search className="h-4 w-4 flex-shrink-0 text-gray-500" />}
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => { setQuery(""); setResults([]); setOpen(false); }}
          >
            <X className="h-3.5 w-3.5 text-gray-500 hover:text-white" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#111] shadow-2xl"
          >
            {results.map(r => (
              <Link
                key={`${r.type}-${r.id}`}
                href={r.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 transition hover:bg-white/5"
              >
                <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${
                  r.type === "project" ? "bg-blue-500/10 text-blue-400" : "bg-[#2563EB]/10 text-[#2563EB]"
                }`}>
                  {r.type === "project" ? <FolderOpen className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{r.title}</p>
                  {r.subtitle && <p className="truncate text-[11px] text-gray-500">{r.subtitle}</p>}
                </div>
              </Link>
            ))}
            <Link
              href={`/jobs?q=${encodeURIComponent(query)}`}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 border-t border-white/10 px-4 py-2.5 text-xs text-gray-600 transition hover:text-white"
            >
              <Search className="h-3 w-3" /> See all results for &ldquo;{query}&rdquo;
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
