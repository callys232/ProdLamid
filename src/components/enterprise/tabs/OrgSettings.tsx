"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Lock, Trash2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import type { Organization } from "@/types/enterprise";

interface Props {
  org: Organization | null;
  orgRole: string;
}

const input = "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 transition focus:border-[#c12129]/40 focus:outline-none";

export default function OrgSettings({ org, orgRole }: Props) {
  const [form, setForm] = useState({
    name:     org?.name     ?? "",
    industry: org?.industry ?? "",
    website:  org?.website  ?? "",
  });
  const [settings, setSettings] = useState({
    allowPublicProjects:    org?.settings?.allowPublicProjects    ?? true,
    requireApprovalForBids: org?.settings?.requireApprovalForBids ?? false,
    whiteLabelEnabled:      org?.settings?.whiteLabelEnabled      ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isAdmin = orgRole === "org_admin";
  const isPlusTier = org?.tier === "enterprise_plus";

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/enterprise/org", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, settings }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Settings saved");
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Org profile */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-gray-400">Organisation Profile</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Organisation Name</label>
            <input className={input} value={form.name} disabled={!isAdmin} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Industry</label>
            <input className={input} value={form.industry} disabled={!isAdmin} placeholder="e.g. Financial Services" onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Website</label>
            <input className={input} value={form.website} disabled={!isAdmin} placeholder="https://yourcompany.com" onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
          </div>
        </div>
      </div>

      {/* Platform settings */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-gray-400">Platform Settings</h3>
        <div className="space-y-4">
          {[
            { key: "allowPublicProjects",    label: "Allow Public Projects",    desc: "Projects posted by org members appear in the public marketplace" },
            { key: "requireApprovalForBids", label: "Require Bid Approval",     desc: "Org admin must approve consultant bids before they're accepted" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                disabled={!isAdmin}
                onClick={() => setSettings(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${
                  settings[key as keyof typeof settings] ? "bg-[#c12129]" : "bg-white/20"
                } ${!isAdmin ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <motion.span
                  animate={{ x: settings[key as keyof typeof settings] ? 18 : 2 }}
                  className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow"
                />
              </motion.button>
            </div>
          ))}

          {/* White-label — Enterprise+ only */}
          <div className={`flex items-start justify-between gap-4 ${!isPlusTier ? "opacity-40" : ""}`}>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white">White-Label Portal</p>
                {!isPlusTier && <Lock className="h-3 w-3 text-gray-500" />}
              </div>
              <p className="text-xs text-gray-500">Deploy a fully branded version of the platform. Enterprise+ only.</p>
            </div>
            <motion.button
              whileTap={isPlusTier ? { scale: 0.9 } : {}}
              disabled={!isAdmin || !isPlusTier}
              onClick={() => isPlusTier && setSettings(p => ({ ...p, whiteLabelEnabled: !p.whiteLabelEnabled }))}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${
                settings.whiteLabelEnabled ? "bg-[#c12129]" : "bg-white/20"
              } ${(!isAdmin || !isPlusTier) ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <motion.span
                animate={{ x: settings.whiteLabelEnabled ? 18 : 2 }}
                className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow"
              />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Save button */}
      {isAdmin && (
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-[#c12129] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </motion.button>
      )}

      {/* Danger zone */}
      {isAdmin && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
          <h3 className="mb-2 text-sm font-semibold text-red-400">Danger Zone</h3>
          <p className="mb-4 text-xs text-gray-500">Deleting your organisation is permanent. All projects, members, and data will be lost.</p>
          {!confirmDelete ? (
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" /> Delete Organisation
            </motion.button>
          ) : (
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => toast.error("Contact support to delete your org")}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Yes, delete permanently
              </motion.button>
              <button onClick={() => setConfirmDelete(false)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:text-white">
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
