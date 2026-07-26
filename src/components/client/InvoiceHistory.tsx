"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface Props {
  userId: string;
}

interface EscrowRecord {
  _id?: string;
  projectId: string;
  milestoneId?: string;
  amount: number;
  currency?: string;
  status: "pending" | "funded" | "released" | "failed";
  createdAt?: string;
  updatedAt?: string;
  action?: string;
}

interface Project {
  _id?: string;
  id?: string;
  title: string;
  consultants?: string[];
  ownerId?: string;
}

type InvoiceStatus = "paid" | "pending" | "overdue";
type FilterType = "all" | InvoiceStatus;

interface Invoice {
  id: string;
  invoiceNumber: string;
  projectId: string;
  projectName: string;
  consultantId?: string;
  amount: number;
  currency: string;
  issuedDate: string;
  status: InvoiceStatus;
  milestoneId?: string;
  action?: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmt(n: number, currency = "USD") {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

function toInvoiceStatus(escrow: EscrowRecord): InvoiceStatus {
  if (escrow.status === "released") return "paid";
  if (escrow.status === "failed") return "overdue";
  return "pending"; // funded or pending
}

function invoiceNumber(idx: number, date: string) {
  const y = new Date(date).getFullYear();
  return `INV-${y}-${String(idx + 1).padStart(4, "0")}`;
}

function mapEscrowToInvoices(escrows: EscrowRecord[], projects: Project[]): Invoice[] {
  const projectMap = new Map<string, Project>(projects.map((p) => [p._id ?? p.id ?? "", p]));
  return escrows.map((e, i) => {
    const proj = projectMap.get(e.projectId);
    return {
      id: e._id ?? `inv-${i}`,
      invoiceNumber: invoiceNumber(i, e.createdAt ?? new Date().toISOString()),
      projectId: e.projectId,
      projectName: proj?.title ?? "Unknown Project",
      consultantId: proj?.consultants?.[0],
      amount: e.amount,
      currency: e.currency ?? "NGN",
      issuedDate: e.createdAt ?? new Date().toISOString(),
      status: toInvoiceStatus(e),
      milestoneId: e.milestoneId,
      action: e.action,
    };
  });
}

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  paid: "bg-emerald-900/30 text-emerald-400 border border-emerald-800",
  pending: "bg-amber-900/30 text-amber-400 border border-amber-800",
  overdue: "bg-blue-900/30 text-blue-400 border border-blue-800",
};

export default function InvoiceHistory({ userId }: Props) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [filterMonth, setFilterMonth] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [escrowRes, projectsRes] = await Promise.all([
        fetch("/api/escrow"),
        fetch("/api/projects?role=owner"),
      ]);
      const escrowJson = await escrowRes.json();
      const projectsJson = await projectsRes.json();

      const escrows: EscrowRecord[] = escrowJson.success ? escrowJson.data ?? [] : [];
      const projects: Project[] = projectsJson.success ? projectsJson.data ?? [] : [];
      setInvoices(mapEscrowToInvoices(escrows, projects));
    } catch {
      setError("Failed to load invoice data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Close modal on outside click
  useEffect(() => {
    if (!selectedInvoice) return;
    function handle(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setSelectedInvoice(null);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [selectedInvoice]);

  // Summary stats
  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const pendingCount = invoices.filter((i) => i.status === "pending").length;
  const lastPaid = invoices.filter((i) => i.status === "paid").sort(
    (a, b) => new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()
  )[0];

  // Filters
  const years = [...new Set(invoices.map((i) => new Date(i.issuedDate).getFullYear()))].sort((a, b) => b - a);

  const filtered = invoices.filter((inv) => {
    if (filter !== "all" && inv.status !== filter) return false;
    const d = new Date(inv.issuedDate);
    if (filterMonth && d.getMonth() !== Number(filterMonth)) return false;
    if (filterYear && d.getFullYear() !== Number(filterYear)) return false;
    return true;
  });

  // PDF print
  function printInvoice(inv: Invoice) {
    const win = window.open("", "_blank");
    if (!win) return;
    const date = new Date(inv.issuedDate);
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${inv.invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
    h1 { color: #2563EB; margin-bottom: 4px; }
    .meta { color: #666; font-size: 13px; margin-bottom: 32px; }
    .section { margin-bottom: 24px; }
    .label { font-size: 12px; color: #999; margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th { text-align: left; border-bottom: 2px solid #eee; padding: 8px 0; font-size: 13px; color: #666; }
    td { padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
    .total { font-weight: bold; font-size: 16px; }
    .status { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px;
      background: ${inv.status === "paid" ? "#d1fae5" : inv.status === "pending" ? "#fef3c7" : "#fee2e2"};
      color: ${inv.status === "paid" ? "#065f46" : inv.status === "pending" ? "#92400e" : "#991b1b"};
    }
    @media print { button { display: none; } }
  </style>
</head>
<body>
  <h1>LAMID</h1>
  <div class="meta">Invoice from LAMID Platform</div>

  <div style="display:flex; justify-content:space-between; margin-bottom:32px;">
    <div class="section">
      <div class="label">Invoice Number</div>
      <div style="font-size:15px; font-weight:bold">${inv.invoiceNumber}</div>
    </div>
    <div class="section">
      <div class="label">Issue Date</div>
      <div>${date.toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</div>
    </div>
    <div class="section">
      <div class="label">Status</div>
      <span class="status">${inv.status.toUpperCase()}</span>
    </div>
  </div>

  <div style="display:flex; justify-content:space-between; margin-bottom:32px;">
    <div class="section">
      <div class="label">Bill To (Client ID)</div>
      <div>${userId}</div>
    </div>
    <div class="section">
      <div class="label">Project</div>
      <div>${inv.projectName}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align:right">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${inv.action ?? "Milestone payment"} — ${inv.projectName}${inv.milestoneId ? ` (Milestone #${inv.milestoneId.slice(-6)})` : ""}</td>
        <td style="text-align:right">${fmt(inv.amount, inv.currency)}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td class="total">Total</td>
        <td style="text-align:right" class="total">${fmt(inv.amount, inv.currency)}</td>
      </tr>
    </tfoot>
  </table>

  <div style="margin-top:40px; text-align:center; color:#ccc; font-size:12px;">
    Generated by LAMID Platform · ${new Date().toLocaleDateString()}
  </div>
  <button onclick="window.print()" style="margin-top:24px; padding:10px 24px; background:#2563EB; color:white; border:none; border-radius:8px; cursor:pointer; font-size:14px;">
    Print / Save PDF
  </button>
</body>
</html>`);
    win.document.close();
    win.focus();
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-800 rounded-2xl" />)}
        </div>
        {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-800 rounded-xl" />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-blue-900/30 border border-blue-700 rounded-2xl p-6 text-blue-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      {/* ── A. Summary Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-xs text-gray-400 mb-1">Total Paid (all time)</p>
          <p className="text-xl font-bold text-emerald-400">{fmt(totalPaid)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-xs text-gray-400 mb-1">Pending Invoices</p>
          <p className="text-xl font-bold text-amber-400">{pendingCount}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-xs text-gray-400 mb-1">Last Payment Date</p>
          <p className="text-xl font-bold text-white">
            {lastPaid
              ? new Date(lastPaid.issuedDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
              : "—"}
          </p>
        </div>
      </div>

      {/* ── D. Filters ── */}
      <div className="flex flex-wrap gap-3 items-center">
        {(["all", "paid", "pending", "overdue"] as FilterType[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition capitalize ${
              filter === f
                ? "bg-[#2563EB] text-white"
                : "bg-gray-900 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
            }`}
          >
            {f}
          </button>
        ))}

        <div className="flex gap-2 ml-auto">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#2563EB]"
          >
            <option value="">All months</option>
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#2563EB]"
          >
            <option value="">All years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* ── B. Invoice Table ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">No invoices found for the selected filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500">
                  <th className="text-left px-5 py-3 font-medium">Invoice #</th>
                  <th className="text-left px-5 py-3 font-medium">Project</th>
                  <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Date</th>
                  <th className="text-right px-5 py-3 font-medium">Amount</th>
                  <th className="text-center px-5 py-3 font-medium">Status</th>
                  <th className="text-right px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr key={inv.id} className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30 transition">
                    <td className="px-5 py-3 font-mono text-gray-300 text-xs">{inv.invoiceNumber}</td>
                    <td className="px-5 py-3 text-white font-medium max-w-[180px] truncate">{inv.projectName}</td>
                    <td className="px-5 py-3 text-gray-400 hidden md:table-cell">
                      {new Date(inv.issuedDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-white">{fmt(inv.amount, inv.currency)}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_STYLES[inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedInvoice(inv)}
                          className="rounded-xl px-3 py-1.5 text-xs font-semibold bg-gray-800 text-gray-300 hover:text-white transition"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => printInvoice(inv)}
                          className="rounded-xl px-3 py-1.5 text-xs font-semibold bg-gray-800 text-gray-300 hover:text-white transition"
                        >
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── C. Invoice Detail Modal ── */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div
            ref={modalRef}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#2563EB] font-black text-xl tracking-tight">LAMID</span>
                  <span className="text-gray-600 text-sm">Invoice</span>
                </div>
                <p className="text-gray-400 text-xs">lamid.io · Professional Services Platform</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-500 hover:text-white transition text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Meta Row */}
            <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-800">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Invoice #</p>
                <p className="text-sm text-white font-mono">{selectedInvoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Issued</p>
                <p className="text-sm text-white">
                  {new Date(selectedInvoice.issuedDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Status</p>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_STYLES[selectedInvoice.status]}`}>
                  {selectedInvoice.status}
                </span>
              </div>
            </div>

            {/* Bill To / From */}
            <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-800">
              <div>
                <p className="text-xs text-gray-500 mb-1">Bill To</p>
                <p className="text-sm text-white font-medium">Client ID</p>
                <p className="text-xs text-gray-400 font-mono">{userId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Project</p>
                <p className="text-sm text-white font-medium">{selectedInvoice.projectName}</p>
                <p className="text-xs text-gray-400 font-mono">{selectedInvoice.projectId.slice(-8)}</p>
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-6 pb-6 border-b border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-800">
                    <th className="text-left pb-2 font-medium">Description</th>
                    <th className="text-right pb-2 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 text-white">
                      {selectedInvoice.action ?? "Milestone payment"}
                      {selectedInvoice.milestoneId && (
                        <span className="ml-2 text-xs text-gray-500 font-mono">
                          #{selectedInvoice.milestoneId.slice(-6)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right text-white font-semibold">
                      {fmt(selectedInvoice.amount, selectedInvoice.currency)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 text-sm">Total</span>
              <span className="text-xl font-bold text-white">{fmt(selectedInvoice.amount, selectedInvoice.currency)}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="rounded-xl px-4 py-2 text-sm font-semibold border border-gray-700 text-gray-300 hover:text-white transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => printInvoice(selectedInvoice)}
                className="rounded-xl px-4 py-2 text-sm font-semibold bg-[#2563EB] text-white hover:bg-blue-700 transition"
              >
                Download / Print PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
