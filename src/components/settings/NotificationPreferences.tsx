"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Save, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

interface Prefs {
  emailNotifications: boolean;
  projectUpdates:     boolean;
  messages:           boolean;
  billing:            boolean;
}

const PREF_LABELS: { key: keyof Prefs; label: string; desc: string }[] = [
  { key: "emailNotifications", label: "Email Notifications",   desc: "Receive email for activity on your account" },
  { key: "projectUpdates",     label: "Project Updates",       desc: "Bid accepted, milestone approved, project completed" },
  { key: "messages",           label: "Message Notifications", desc: "New messages from clients or consultants" },
  { key: "billing",            label: "Billing & Payments",    desc: "Escrow funded, payment released, invoices" },
];

export default function NotificationPreferences() {
  const [prefs,   setPrefs]   = useState<Prefs>({ emailNotifications: true, projectUpdates: true, messages: true, billing: true });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    fetch("/api/user/notification-preferences")
      .then(r => r.json())
      .then(d => { if (d.success) setPrefs(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/user/notification-preferences", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(prefs),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Preferences saved");
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="h-32 animate-pulse rounded-xl bg-white/5" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4 text-[#c12129]" />
        <h2 className="text-base font-bold text-white">Notification Preferences</h2>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 divide-y divide-white/5">
        {PREF_LABELS.map(({ key, label, desc }) => (
          <div key={key} className="flex items-start justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setPrefs(p => ({ ...p, [key]: !p[key] }))}
              className={`relative mt-0.5 inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                prefs[key] ? "bg-[#c12129]" : "bg-white/20"
              }`}
            >
              <motion.span
                animate={{ x: prefs[key] ? 18 : 2 }}
                className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow"
              />
            </motion.button>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 rounded-xl bg-[#c12129] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
      >
        {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? "Saving…" : "Save Preferences"}
      </motion.button>
    </div>
  );
}
