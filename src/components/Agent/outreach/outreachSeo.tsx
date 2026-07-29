"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Search, Plus, Send, Shield, Loader2, Check } from "lucide-react";

interface Campaign {
  subject:    string;
  content:    string;
  recipients: string[];
}

interface OutreachData {
  campaigns:    Campaign[];
  keywords:     string[];
  projectTitle?: string;
}

interface Props {
  projectId: string;
  isAdmin?:  boolean;
}

export default function OutreachSEOAgent({ projectId, isAdmin = false }: Props) {
  const [data,         setData]         = useState<OutreachData | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [subject,      setSubject]      = useState("");
  const [content,      setContent]      = useState("");
  const [recipients,   setRecipients]   = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState("");
  const [newKeyword,   setNewKeyword]   = useState("");

  // ── Admin guard ──────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 border border-orange-500/20">
          <Shield className="h-6 w-6 text-orange-400" />
        </div>
        <p className="text-sm font-semibold text-white">Admin Access Required</p>
        <p className="text-xs text-gray-500 max-w-xs">
          The Outreach & SEO agent is restricted to administrators only.
          Contact your org admin to request access.
        </p>
      </div>
    );
  }

  // ── Fetch ────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    fetch(`/api/projects/${projectId}/outreach`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setData(d?.data ?? { campaigns: [], keywords: [] }))
      .catch(() => setData({
        campaigns: [{ subject: "November Promo", content: "Save 20% on premium plans this month!", recipients: ["marketing@company.com"] }],
        keywords:  ["AI Copilot", "Project Analytics", "Lamid Premium"],
      }))
      .finally(() => setLoading(false));
  }, [projectId]);

  // ── Save ─────────────────────────────────────────────────────
  async function save() {
    if (!data) return;
    setSaving(true);
    try {
      await fetch(`/api/projects/${projectId}/outreach`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ campaigns: data.campaigns, keywords: data.keywords }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { /* silent */ } finally {
      setSaving(false);
    }
  }

  function addRecipient() {
    if (newRecipient.trim()) { setRecipients(p => [...p, newRecipient.trim()]); setNewRecipient(""); }
  }

  function addKeyword() {
    if (newKeyword.trim() && data) { setData({ ...data, keywords: [...data.keywords, newKeyword.trim()] }); setNewKeyword(""); }
  }

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-gray-500" /></div>;

  return (
    <div className="space-y-5 text-white">
      {/* Admin badge */}
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-orange-400" />
        <span className="text-xs font-semibold uppercase tracking-widest text-orange-400">Admin — Outreach & SEO</span>
        {data?.projectTitle && <span className="text-xs text-gray-500 ml-auto truncate">{data.projectTitle}</span>}
      </div>

      {/* Campaign builder */}
      <div className="bg-[#1a1a1a] rounded-lg border border-[#1f1f1f] p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-[#2563EB]" />
          <p className="text-xs font-semibold text-white">Campaign Builder</p>
        </div>
        <input type="text" placeholder="Subject line" value={subject}
          onChange={e => setSubject(e.target.value)}
          className="w-full rounded-lg bg-[#0f0f0f] border border-[#333] text-sm text-white px-3 py-2.5 focus:outline-none focus:border-[#2563EB]/50" />
        <textarea placeholder="Campaign content" value={content} rows={4}
          onChange={e => setContent(e.target.value)}
          className="w-full rounded-lg bg-[#0f0f0f] border border-[#333] text-sm text-white px-3 py-2.5 focus:outline-none focus:border-[#2563EB]/50 resize-none" />

        {/* Recipients */}
        <div className="flex gap-2">
          <input type="email" placeholder="Add recipient email" value={newRecipient}
            onChange={e => setNewRecipient(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addRecipient()}
            className="flex-1 rounded-lg bg-[#0f0f0f] border border-[#333] text-xs text-white px-2.5 py-2 focus:outline-none focus:border-[#2563EB]/50" />
          <button onClick={addRecipient} className="rounded-lg bg-[#2563EB] px-3 py-2 text-xs text-white">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        {recipients.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {recipients.map((r, i) => (
              <span key={i} className="flex items-center gap-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 px-2 py-0.5 text-[10px] text-gray-600">
                <Mail className="h-2.5 w-2.5 text-[#2563EB]" /> {r}
                <button onClick={() => setRecipients(p => p.filter((_, idx) => idx !== i))} className="text-gray-600 hover:text-blue-400 ml-0.5">×</button>
              </span>
            ))}
          </div>
        )}

        {/* Preview */}
        {(subject || content) && (
          <div className="rounded-lg bg-[#0f0f0f] border border-[#333] hover:border-[#2563EB]/40 transition-colors p-3">
            <p className="text-xs font-semibold text-[#2563EB]">{subject || "Draft Subject"}</p>
            <p className="text-xs text-gray-600 mt-1">{content || "Draft content goes here..."}</p>
            <p className="text-[10px] text-gray-600 mt-1.5">Recipients: {recipients.length}</p>
          </div>
        )}
      </div>

      {/* Keyword tracking */}
      <div className="bg-[#1a1a1a] rounded-lg border border-[#1f1f1f] p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-blue-400" />
          <p className="text-xs font-semibold text-white">Keyword Tracking</p>
        </div>
        {data?.keywords.map((k, i) => (
          <div key={i} className="flex items-center justify-between text-xs text-gray-600 bg-[#0f0f0f] rounded-lg px-3 py-2 border border-[#333]">
            <span className="flex items-center gap-1.5"><Search className="h-3 w-3 text-blue-400" />{k}</span>
            <button onClick={() => setData(d => d ? { ...d, keywords: d.keywords.filter((_, idx) => idx !== i) } : d)}
              className="text-gray-600 hover:text-blue-400 transition-colors text-xs">×</button>
          </div>
        ))}
        <div className="flex gap-2">
          <input type="text" placeholder="Add keyword" value={newKeyword}
            onChange={e => setNewKeyword(e.target.value)}
            id="outreach-keyword-input"
            onKeyDown={e => e.key === "Enter" && addKeyword()}
            className="flex-1 rounded-lg bg-[#0f0f0f] border border-[#333] text-xs text-white px-2.5 py-2 focus:outline-none focus:border-blue-500/50" />
          <button onClick={addKeyword} className="rounded-lg bg-blue-600 px-3 py-2 text-xs text-white">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Admin actions */}
      <div className="flex flex-wrap gap-2">
        <motion.button whileTap={{ scale: 0.95 }} onClick={save} disabled={saving}
          className="flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
          {saved ? "Saved!" : "Save Campaign"}
        </motion.button>
        <a href="/contact-sales"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-white/10 transition-colors">
          Manage Lists
        </a>
        <button type="button"
          onClick={() => { const el = document.getElementById("outreach-keyword-input"); el?.focus(); el?.scrollIntoView({ behavior: "smooth" }); }}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-white/10 transition-colors">
          Adjust Keywords
        </button>
      </div>
    </div>
  );
}
