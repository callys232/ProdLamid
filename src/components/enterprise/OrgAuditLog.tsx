"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck, Download, Filter, RefreshCw, Search,
  CheckCircle2, XCircle, AlertTriangle, Info,
} from "lucide-react";

/* ── Types ──────────────────────────────────────────────────── */
interface AuditEntry {
  id:       string;
  date:     string;
  user:     string;
  action:   string;
  resource: string;
  outcome:  "success" | "failure" | "warning" | "info";
  detail?:  string;
}

/* ── Helpers ────────────────────────────────────────────────── */
const fadeUp = (i = 0) => ({
  initial:    { opacity: 0, y: 10 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.28, delay: i * 0.05, ease: [0.33, 1, 0.68, 1] as const },
});

const OUTCOME_STYLE: Record<AuditEntry["outcome"], { cls: string; icon: React.ReactNode }> = {
  success: { cls: "border-green-500/30  bg-green-500/10  text-green-400",  icon: <CheckCircle2 className="h-3 w-3" /> },
  failure: { cls: "border-blue-500/30    bg-blue-500/10    text-blue-400",    icon: <XCircle      className="h-3 w-3" /> },
  warning: { cls: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400", icon: <AlertTriangle className="h-3 w-3" /> },
  info:    { cls: "border-gray-600/30   bg-gray-800      text-gray-400",   icon: <Info          className="h-3 w-3" /> },
};

const ACTION_TYPES = ["All", "login", "invite", "project", "escrow", "settings", "member", "billing"];

/* Mock data — in production, comes from /api/enterprise/analytics activity field */
const MOCK_AUDIT: AuditEntry[] = [
  { id: "a001", date: "2026-07-02T14:32:00Z", user: "sarah.o@acme.com",   action: "login",    resource: "Auth",                  outcome: "success" },
  { id: "a002", date: "2026-07-02T13:11:00Z", user: "admin@acme.com",     action: "invite",   resource: "Members",               outcome: "success", detail: "Invited james.t@acme.com" },
  { id: "a003", date: "2026-07-01T16:44:00Z", user: "chukwu.e@acme.com",  action: "project",  resource: "ERP Integration",       outcome: "success", detail: "Posted new project" },
  { id: "a004", date: "2026-07-01T11:20:00Z", user: "admin@acme.com",     action: "escrow",   resource: "Data Warehouse Build",  outcome: "success", detail: "Funded ₦1,200,000 milestone" },
  { id: "a005", date: "2026-06-30T09:55:00Z", user: "james.t@acme.com",   action: "login",    resource: "Auth",                  outcome: "failure", detail: "Invalid credentials" },
  { id: "a006", date: "2026-06-30T08:30:00Z", user: "admin@acme.com",     action: "settings", resource: "Org Settings",          outcome: "success", detail: "Updated approval threshold to ₦500,000" },
  { id: "a007", date: "2026-06-29T17:02:00Z", user: "priya.s@acme.com",   action: "member",   resource: "Members",               outcome: "success", detail: "Accepted invitation" },
  { id: "a008", date: "2026-06-29T14:15:00Z", user: "admin@acme.com",     action: "billing",  resource: "Billing",               outcome: "info",    detail: "Invoice INV-1002 downloaded" },
  { id: "a009", date: "2026-06-28T12:00:00Z", user: "chukwu.e@acme.com",  action: "escrow",   resource: "SaaS Dashboard Rebuild",outcome: "warning", detail: "Escrow release request above threshold — pending approval" },
  { id: "a010", date: "2026-06-28T10:45:00Z", user: "admin@acme.com",     action: "project",  resource: "Marketing Analytics",   outcome: "success", detail: "Approved consultant bid" },
  { id: "a011", date: "2026-06-27T16:30:00Z", user: "sarah.o@acme.com",   action: "member",   resource: "Members",               outcome: "success", detail: "Suspended member: demo.user@acme.com" },
  { id: "a012", date: "2026-06-27T09:10:00Z", user: "james.t@acme.com",   action: "login",    resource: "Auth",                  outcome: "success" },
  { id: "a013", date: "2026-06-26T15:22:00Z", user: "admin@acme.com",     action: "settings", resource: "Org Settings",          outcome: "success", detail: "Enabled white-label mode" },
  { id: "a014", date: "2026-06-26T11:05:00Z", user: "priya.s@acme.com",   action: "project",  resource: "Customer Analytics",    outcome: "info",    detail: "Viewed project bids" },
  { id: "a015", date: "2026-06-25T14:00:00Z", user: "chukwu.e@acme.com",  action: "invite",   resource: "Members",               outcome: "failure", detail: "Invite failed — member limit reached" },
];

/* ── CSV export ─────────────────────────────────────────────── */
function exportCSV(rows: AuditEntry[]) {
  const headers = ["ID", "Date", "User", "Action", "Resource", "Outcome", "Detail"];
  const lines = rows.map(r =>
    [r.id, r.date, r.user, r.action, r.resource, r.outcome, r.detail ?? ""]
      .map(v => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [headers.join(","), ...lines].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), { href: url, download: "audit-log.csv" });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── Component ──────────────────────────────────────────────── */
export default function OrgAuditLog() {
  const [entries,    setEntries]    = useState<AuditEntry[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /* Filters */
  const [search,      setSearch]      = useState("");
  const [actionType,  setActionType]  = useState("All");
  const [outcomeFilter, setOutcomeFilter] = useState<AuditEntry["outcome"] | "All">("All");
  const [dateFrom,    setDateFrom]    = useState("");
  const [dateTo,      setDateTo]      = useState("");
  const [userFilter,  setUserFilter]  = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  /* Pagination */
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    try {
      const res = await fetch("/api/enterprise/analytics");
      if (res.ok) {
        const { data } = await res.json();
        /* Real API may include an "activity" array — fall back to mock */
        if (Array.isArray(data?.activity) && data.activity.length > 0) {
          setEntries(data.activity);
          return;
        }
      }
    } catch {}
    setEntries(MOCK_AUDIT);
    if (refresh) setRefreshing(false);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  /* Filtered rows */
  const filtered = useMemo(() => {
    return entries.filter(e => {
      const matchSearch  = !search      || e.user.includes(search) || e.action.includes(search) || e.resource.toLowerCase().includes(search.toLowerCase()) || (e.detail ?? "").toLowerCase().includes(search.toLowerCase());
      const matchAction  = actionType === "All" || e.action === actionType;
      const matchOutcome = outcomeFilter === "All" || e.outcome === outcomeFilter;
      const matchUser    = !userFilter  || e.user.toLowerCase().includes(userFilter.toLowerCase());
      const matchFrom    = !dateFrom    || new Date(e.date) >= new Date(dateFrom);
      const matchTo      = !dateTo      || new Date(e.date) <= new Date(dateTo + "T23:59:59Z");
      return matchSearch && matchAction && matchOutcome && matchUser && matchFrom && matchTo;
    });
  }, [entries, search, actionType, outcomeFilter, userFilter, dateFrom, dateTo]);

  const pageCount  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* Reset to page 1 whenever filter changes */
  useEffect(() => { setPage(1); }, [search, actionType, outcomeFilter, userFilter, dateFrom, dateTo]);

  /* ── Render ───────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex items-center justify-center p-16 bg-gray-950 min-h-screen">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 bg-gray-950 min-h-screen">

      {/* Section label */}
      <motion.div {...fadeUp(0)} className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-purple-400" />
        <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">
          Org Audit Log
        </span>
      </motion.div>

      {/* Toolbar */}
      <motion.div {...fadeUp(1)}
        className="rounded-2xl border border-gray-800 bg-gray-900 p-4 space-y-3"
      >
        {/* Top row: search + buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search entries…"
              className="w-full rounded-xl border border-gray-700 bg-gray-950 pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => setFiltersOpen(o => !o)}
            className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-medium transition ${
              filtersOpen
                ? "border-purple-500/40 bg-purple-500/10 text-purple-400"
                : "border-gray-700 bg-gray-950 text-gray-400 hover:text-white"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => load(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-xl border border-gray-700 bg-gray-950 px-4 py-2 text-xs font-medium text-gray-400 transition hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-1.5 rounded-xl border border-[#2563EB]/30 bg-[#2563EB]/10 px-4 py-2 text-xs font-semibold text-[#2563EB] transition hover:bg-[#2563EB]/20"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </motion.button>
        </div>

        {/* Filter panel */}
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-gray-800"
          >
            {/* Action type */}
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Action</label>
              <select
                value={actionType}
                onChange={e => setActionType(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
              >
                {ACTION_TYPES.map(t => <option key={t} value={t}>{t === "All" ? "All actions" : t}</option>)}
              </select>
            </div>

            {/* Outcome */}
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Outcome</label>
              <select
                value={outcomeFilter}
                onChange={e => setOutcomeFilter(e.target.value as any)}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
              >
                {["All", "success", "failure", "warning", "info"].map(o => (
                  <option key={o} value={o}>{o === "All" ? "All outcomes" : o}</option>
                ))}
              </select>
            </div>

            {/* User filter */}
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">User</label>
              <input
                type="text"
                value={userFilter}
                onChange={e => setUserFilter(e.target.value)}
                placeholder="Filter by user…"
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            {/* Date from */}
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">From date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/50 [color-scheme:dark]"
              />
            </div>

            {/* Date to */}
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">To date</label>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/50 [color-scheme:dark]"
              />
            </div>
          </motion.div>
        )}

        {/* Result count */}
        <p className="text-[10px] text-gray-600">
          Showing {paginated.length} of {filtered.length} entries
          {filtered.length !== entries.length && ` (${entries.length} total)`}
        </p>
      </motion.div>

      {/* Table */}
      <motion.div {...fadeUp(2)}
        className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden"
      >
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-800 text-[10px] uppercase tracking-widest text-gray-500">
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Action</th>
                <th className="px-4 py-3 text-left font-medium">Resource</th>
                <th className="px-4 py-3 text-left font-medium">Detail</th>
                <th className="px-4 py-3 text-center font-medium">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-600 text-sm">
                    No entries match the current filters
                  </td>
                </tr>
              ) : (
                paginated.map((entry, i) => {
                  const os = OUTCOME_STYLE[entry.outcome];
                  return (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-white/[0.02] transition"
                    >
                      <td className="px-4 py-3 text-[11px] text-gray-500 whitespace-nowrap">
                        {new Date(entry.date).toLocaleString("en-GB", {
                          day: "2-digit", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-300 max-w-[160px] truncate">
                        {entry.user}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full border border-gray-700 bg-gray-800 px-2.5 py-0.5 text-[10px] font-medium text-gray-300 capitalize">
                          {entry.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-white max-w-[140px] truncate">
                        {entry.resource}
                      </td>
                      <td className="px-4 py-3 text-[11px] text-gray-500 max-w-[200px] truncate">
                        {entry.detail ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold capitalize ${os.cls}`}>
                          {os.icon}
                          {entry.outcome}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="border-t border-gray-800 px-4 py-3 flex items-center justify-between">
            <p className="text-[10px] text-gray-600">
              Page {page} of {pageCount}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-1.5 text-[11px] text-gray-400 transition hover:text-white disabled:opacity-40"
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, pageCount - 4));
                const p = start + i;
                if (p > pageCount) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`rounded-lg border px-3 py-1.5 text-[11px] transition ${
                      p === page
                        ? "border-purple-500/40 bg-purple-500/10 text-purple-400"
                        : "border-gray-700 bg-gray-950 text-gray-400 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(pageCount, p + 1))}
                disabled={page === pageCount}
                className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-1.5 text-[11px] text-gray-400 transition hover:text-white disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </motion.div>

    </div>
  );
}
