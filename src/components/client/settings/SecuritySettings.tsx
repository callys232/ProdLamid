"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Shield, ShieldCheck, ShieldOff, Mail, Lock,
  Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle,
} from "lucide-react";

function strengthOf(pw: string) {
  if (!pw) return { label: "", color: "", pct: 0 };
  const score = [/[A-Z]/.test(pw), /[a-z]/.test(pw), /\d/.test(pw), /[^A-Za-z0-9]/.test(pw), pw.length >= 8].filter(Boolean).length;
  if (score <= 2) return { label: "Weak",   color: "bg-red-500",    pct: 33 };
  if (score <= 3) return { label: "Medium", color: "bg-yellow-400", pct: 66 };
  return           { label: "Strong",  color: "bg-emerald-500", pct: 100 };
}

export default function SecuritySettings({ user }: { user: any }) {
  const [oldPw,     setOldPw]     = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const [twoFA,    setTwoFA]    = useState(!!user?.twoFAEnabled);
  const [faStep,   setFaStep]   = useState<"idle" | "sending" | "code">("idle");
  const [otp,      setOtp]      = useState("");
  const [disablePw, setDisablePw] = useState("");
  const [faLoading, setFaLoading] = useState(false);
  const [showDis,   setShowDis]   = useState(false);

  const strength = strengthOf(newPw);

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    if (newPw !== confirmPw) { toast.error("Passwords do not match"); return; }
    if (strength.label === "Weak") { toast.error("Choose a stronger password"); return; }
    setPwLoading(true);
    const tid = toast.loading("Updating password…");
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword: oldPw, newPassword: newPw }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message);
      toast.success("Password updated!", { id: tid });
      setOldPw(""); setNewPw(""); setConfirmPw("");
    } catch (e: any) {
      toast.error(e.message ?? "Failed", { id: tid });
    } finally { setPwLoading(false); }
  }

  async function send2FACode() {
    setFaLoading(true); setFaStep("sending");
    try {
      const res = await fetch("/api/auth/2fa/enable", { method: "POST" });
      const d   = await res.json();
      if (!res.ok) throw new Error(d.message);
      toast.success("Code sent to your email");
      setOtp(""); setFaStep("code");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to send code");
      setFaStep("idle");
    } finally { setFaLoading(false); }
  }

  async function verify2FA() {
    if (otp.length !== 6) return;
    setFaLoading(true);
    const tid = toast.loading("Verifying…");
    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otp }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message);
      toast.success("2FA enabled! 🛡️", { id: tid });
      setTwoFA(true); setFaStep("idle"); setOtp("");
    } catch (e: any) {
      toast.error(e.message ?? "Invalid code", { id: tid });
    } finally { setFaLoading(false); }
  }

  async function disable2FA() {
    setFaLoading(true);
    const tid = toast.loading("Disabling 2FA…");
    try {
      const res = await fetch("/api/auth/2fa/disable", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: disablePw }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message);
      toast.success("2FA disabled", { id: tid });
      setTwoFA(false); setShowDis(false); setDisablePw("");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to disable 2FA", { id: tid });
    } finally { setFaLoading(false); }
  }

  return (
    <div className="space-y-6 max-w-2xl">

      {/* ── 2FA Card ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        whileHover={{ boxShadow: "0 8px 32px rgba(0,0,0,0.35)" }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={twoFA ? { boxShadow: "0 0 20px rgba(16,185,129,0.2)" } : {}}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                twoFA ? "border-emerald-500/30 bg-emerald-500/10" : "border-white/10 bg-white/5"
              }`}
            >
              <Shield className={`h-5 w-5 ${twoFA ? "text-emerald-400" : "text-gray-400"}`} />
            </motion.div>
            <div>
              <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500 mt-0.5">Email OTP — second layer of login security</p>
            </div>
          </div>
          <motion.span layout
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
              twoFA ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-gray-500/20 bg-white/5 text-gray-400"
            }`}
          >
            {twoFA ? <><ShieldCheck className="h-3.5 w-3.5" /> Enabled</>
                   : <><ShieldOff   className="h-3.5 w-3.5" /> Disabled</>}
          </motion.span>
        </div>

        <AnimatePresence mode="wait" initial={false}>

          {/* Enabled + stable */}
          {twoFA && !showDis && (
            <motion.div key="on"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <p className="text-sm text-emerald-300">
                  2FA is active. A code is required each time you sign in.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 4px 16px rgba(239,68,68,0.2)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowDis(true)}
                className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/15"
              >
                <ShieldOff className="h-4 w-4" /> Disable 2FA
              </motion.button>
            </motion.div>
          )}

          {/* Disable confirmation */}
          {twoFA && showDis && (
            <motion.div key="dis"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/8 px-4 py-3">
                <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-300">
                  Disabling 2FA reduces your account security. Confirm your password to continue.
                </p>
              </div>
              <div className="flex gap-3">
                <input
                  type="password" value={disablePw}
                  onChange={e => setDisablePw(e.target.value)}
                  placeholder="Your current password"
                  className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 transition"
                />
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 4px 14px rgba(185,28,28,0.35)" }}
                  whileTap={{ scale: 0.96 }}
                  disabled={faLoading || !disablePw}
                  onClick={disable2FA}
                  className="rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800 disabled:opacity-50"
                >
                  {faLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
                </motion.button>
              </div>
              <button onClick={() => { setShowDis(false); setDisablePw(""); }}
                className="text-xs text-gray-500 hover:text-gray-300 transition">
                Cancel
              </button>
            </motion.div>
          )}

          {/* Not enabled – idle */}
          {!twoFA && faStep === "idle" && (
            <motion.div key="idle"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="space-y-4"
            >
              <p className="text-xs text-gray-500 leading-relaxed">
                When enabled, a 6-digit code will be sent to your email each time you sign in.
              </p>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 6px 20px rgba(193,33,41,0.3)" }}
                whileTap={{ scale: 0.97 }}
                onClick={send2FACode}
                className="flex items-center gap-2 rounded-xl bg-[#c12129] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <Mail className="h-4 w-4" /> Enable Email 2FA
              </motion.button>
            </motion.div>
          )}

          {/* Sending */}
          {!twoFA && faStep === "sending" && (
            <motion.div key="sending"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-3 py-2"
            >
              <Loader2 className="h-4 w-4 animate-spin text-[#c12129]" />
              <span className="text-sm text-gray-400">Sending code to your email…</span>
            </motion.div>
          )}

          {/* OTP entry */}
          {!twoFA && faStep === "code" && (
            <motion.div key="code"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/8 px-4 py-3">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <p className="text-xs text-blue-300">Code sent. Check your inbox and enter it below.</p>
              </div>
              <motion.input
                whileFocus={{ boxShadow: "0 0 0 2px rgba(193,33,41,0.3)" }}
                type="text" inputMode="numeric" maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-center text-2xl font-mono tracking-[0.4em] text-white placeholder-gray-700 focus:outline-none focus:border-[#c12129]/60 transition"
              />
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 4px 16px rgba(193,33,41,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  disabled={faLoading || otp.length !== 6}
                  onClick={verify2FA}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#c12129] py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {faLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  {faLoading ? "Verifying…" : "Verify & Activate"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={send2FACode} disabled={faLoading}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-gray-400 hover:text-white transition disabled:opacity-50"
                >
                  Resend
                </motion.button>
              </div>
              <button onClick={() => setFaStep("idle")} className="text-xs text-gray-500 hover:text-gray-300 transition">
                Cancel
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>

      {/* ── Password Change Card ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        whileHover={{ boxShadow: "0 8px 32px rgba(0,0,0,0.35)" }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Change Password</p>
            <p className="text-xs text-gray-500 mt-0.5">Use a strong, unique password for this account</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Current Password</label>
            <input type="password" value={oldPw} onChange={e => setOldPw(e.target.value)} required
              placeholder="Current password"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c12129]/50 transition" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">New Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={newPw}
                onChange={e => setNewPw(e.target.value)} required
                placeholder="New password (min 8 chars)"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 pr-10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c12129]/50 transition" />
              <motion.button type="button" whileTap={{ scale: 0.85 }}
                onClick={() => setShowPw(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </motion.button>
            </div>
            {newPw && (
              <div className="mt-2 space-y-1">
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div className={`h-full rounded-full ${strength.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${strength.pct}%` }}
                    transition={{ duration: 0.35 }} />
                </div>
                <p className={`text-[11px] ${
                  strength.label === "Strong" ? "text-emerald-400" :
                  strength.label === "Medium" ? "text-yellow-400" : "text-red-400"
                }`}>{strength.label} password</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Confirm New Password</label>
            <input type="password" value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)} required
              placeholder="Repeat new password"
              className={`w-full rounded-xl border bg-black/40 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition ${
                confirmPw && confirmPw !== newPw ? "border-red-500/50 focus:border-red-500/70" : "border-white/10 focus:border-[#c12129]/50"
              }`} />
            {confirmPw && confirmPw !== newPw && (
              <p className="mt-1 text-[11px] text-red-400">Passwords do not match</p>
            )}
          </div>

          <motion.button type="submit"
            disabled={pwLoading || !oldPw || !newPw || newPw !== confirmPw || strength.label === "Weak"}
            whileHover={{ scale: 1.02, boxShadow: "0 6px 20px rgba(193,33,41,0.3)" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-xl bg-[#c12129] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {pwLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {pwLoading ? "Updating…" : "Update Password"}
          </motion.button>
        </form>
      </motion.div>

    </div>
  );
}
