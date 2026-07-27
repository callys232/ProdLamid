"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  Shield,
  ShieldCheck,
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";

/* ─── 2FA Setup Modal ───────────────────────────────────────────── */
function TwoFASetup({
  onDone,
  onSkip,
}: {
  onDone: () => void;
  onSkip: () => void;
}) {
  const [step, setStep] = useState<"prompt" | "code" | "success">("prompt");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendCode() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/enable", { method: "POST" });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message);
      toast.success("Code sent to your email");
      setStep("code");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to send code");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    if (code.length !== 6) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message);
      setStep("success");
      setTimeout(onDone, 1800);
    } catch (e: any) {
      toast.error(e.message ?? "Invalid code — try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.24, ease: [0.33, 1, 0.68, 1] as const }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d0d0d] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/25">
              <Shield className="h-5 w-5 text-[#2563EB]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Secure Your Account
              </h3>
              <p className="text-[11px] text-gray-500">
                Two-factor authentication
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onSkip}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-400 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <AnimatePresence mode="wait" initial={false}>
            {step === "prompt" && (
              <motion.div
                key="prompt"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div className="rounded-xl border border-[#2563EB]/20 bg-[#2563EB]/5 px-4 py-4">
                  <p className="text-sm font-semibold text-white mb-1">
                    We strongly recommend enabling 2FA
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    A one-time code is sent to your email each time you sign in
                    — an extra layer of protection at no cost.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 6px 20px rgba(37,99,235,0.35)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    disabled={loading}
                    onClick={sendCode}
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                    {loading ? "Sending code…" : "Enable 2FA — Send Code"}
                  </motion.button>
                  <button
                    onClick={onSkip}
                    className="text-sm text-gray-500 hover:text-gray-300 transition py-2 text-center"
                  >
                    Skip for now — I&apos;ll enable it in Settings
                  </button>
                </div>
              </motion.div>
            )}

            {step === "code" && (
              <motion.div
                key="code"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div className="text-center">
                  <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-[#2563EB]/15 border border-[#2563EB]/25 mb-3">
                    <Mail className="h-6 w-6 text-[#2563EB]" />
                  </div>
                  <p className="text-sm font-semibold text-white">
                    Check your email
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the 6-digit code we sent you
                  </p>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-center text-2xl font-mono tracking-[0.4em] text-white placeholder-gray-700 focus:outline-none focus:border-[#2563EB]/60 transition"
                />
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 6px 20px rgba(37,99,235,0.35)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  disabled={loading || code.length !== 6}
                  onClick={verifyCode}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  {loading ? "Verifying…" : "Verify & Enable 2FA"}
                </motion.button>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStep("prompt")}
                    className="text-xs text-gray-500 hover:text-gray-300 transition"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={sendCode}
                    disabled={loading}
                    className="text-xs text-gray-500 hover:text-gray-300 transition disabled:opacity-50"
                  >
                    Resend code
                  </button>
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-4 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                    delay: 0.1,
                  }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30"
                >
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </motion.div>
                <div>
                  <p className="text-base font-bold text-white">2FA Enabled!</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Your account is now protected. Taking you to your dashboard…
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Account type cards ────────────────────────────────────────── */
const TYPES = [
  {
    value: "Freelancer",
    label: "Freelancer",
    accent: "#2563EB",
    badge: null as string | null,
    desc: "Consultants seeking projects. Create invoices, track payments, and showcase your services to potential clients.",
  },
  {
    value: "Client",
    label: "Client",
    accent: "#2563EB",
    badge: null,
    desc: "Organisations hiring consultants. Post jobs, manage contracts, and securely pay for completed work.",
  },
  {
    value: "Enterprise",
    label: "Enterprise",
    accent: "#2563EB",
    badge: "New",
    desc: "Large organisations with multi-user workspaces. Up to 50 members, dedicated dashboard, escrow management, and analytics.",
  },
  {
    value: "Concierge",
    label: "Concierge",
    accent: "#eab308",
    badge: "Admin Approval Required",
    desc: "For government agencies, large NGOs and corporations. Dedicated PM, custom dashboards, and 24/7 priority support. Reviewed within 24 hours — no payment required now.",
  },
];

/* ─── Main component ─────────────────────────────────────────────── */
export default function AccountTypePage() {
  const [accountType, setAccountType] = useState("");
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [redirectTo, setRedirectTo] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!accountType) {
      toast.error("Please select an account type ❌");
      return;
    }

    setLoading(true);
    try {
      const raw =
        sessionStorage.getItem("signupData") ??
        localStorage.getItem("signupData");
      if (!raw) {
        toast.error("No signup data found. Please start over.");
        router.push("/signup");
        return;
      }
      const parsed = JSON.parse(raw);

      /* Concierge — request flow, no account created yet */
      if (accountType === "Concierge") {
        const res = await fetch("/api/concierge/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: parsed.UserName,
            email: parsed.email,
            organisation: parsed.companyName ?? parsed.UserName,
          }),
        });
        const d = await res.json();
        if (!res.ok) throw new Error(d.message);
        toast.success(
          "Request submitted! Our team will contact you within 24 hours.",
        );
        sessionStorage.removeItem("signupData");
        localStorage.removeItem("signupData");
        router.push("/signup?concierge=pending");
        return;
      }

      const role =
        accountType === "Freelancer"
          ? "seller"
          : accountType === "Enterprise"
            ? "client"
            : "client";

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: parsed.UserName,
          email: parsed.email,
          password: parsed.password,
          role,
          ...(accountType === "Enterprise" && {
            isEnterprise: true,
            companyName: parsed.companyName ?? parsed.UserName,
          }),
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success)
        throw new Error(result.message ?? "Signup failed");

      toast.success("Account created successfully 🎉");
      // Token is set as HttpOnly cookie by the server — do not store in localStorage.
      // account_type cached for fast UI routing before the next /api/auth/me resolves.
      localStorage.setItem("account_type", accountType);
      sessionStorage.removeItem("signupData");
      localStorage.removeItem("signupData");

      /* A return path set by the results gate wins over the default landing
         page — the user was part-way through something. */
      const rawNext  = searchParams.get("next");
      const safeNext = rawNext?.startsWith("/") && !rawNext.startsWith("//") ? rawNext : null;

      const dest =
        safeNext ??
        (accountType === "Enterprise"
          ? "/enterprise"
          : role === "seller"
            ? "/profile"
            : "/client");

      setRedirectTo(dest);
      setShow2FA(true); // Offer 2FA before final redirect
    } catch (err: any) {
      toast.error(err.message ?? "Signup failed ⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="min-h-screen flex items-center justify-center bg-black px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl w-full bg-black border border-white/15 p-10 rounded-2xl shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-white mb-2 text-center">
            Choose Your Account Type
          </h2>
          <p className="text-gray-400 mb-10 text-center text-sm">
            Select the option that best describes how you&apos;ll use Lamid.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {TYPES.map((t) => {
              const accentClass =
                t.value === "Concierge" ? "accent-yellow" : "accent-red";
              return (
                <motion.label
                  key={t.value}
                  htmlFor={`accountType-${t.value}`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`account-type-card flex items-start gap-4 border rounded-xl p-5 cursor-pointer transition ${accentClass} ${accountType === t.value ? "selected" : "border-white/15 hover:border-white/30"}`}
                >
                  <input
                    id={`accountType-${t.value}`}
                    type="radio"
                    name="accountType"
                    value={t.value}
                    checked={accountType === t.value}
                    onChange={(e) => setAccountType(e.target.value)}
                    title={t.label}
                    aria-label={t.label}
                    className="mt-1"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-base font-semibold account-type-title">
                        {t.label}
                      </h3>
                      {t.badge && (
                        <span className="account-type-badge rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                          {t.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                </motion.label>
              );
            })}

            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 8px 24px rgba(37,99,235,0.4)",
              }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading || !accountType}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#8b1118] text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition disabled:opacity-50 mt-4 shadow-lg"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </section>

      {/* 2FA setup shown immediately after successful registration */}
      <AnimatePresence>
        {show2FA && (
          <TwoFASetup
            onDone={() => {
              setShow2FA(false);
              router.push(redirectTo);
            }}
            onSkip={() => {
              setShow2FA(false);
              router.push(redirectTo);
            }}
          />
        )}
      </AnimatePresence>
      <style jsx>{`
        .account-type-card {
          --accent: #2563EB;
          --accent-bg: rgba(37,99,235, 0.06);
          --badge-border: rgba(37,99,235, 0.31);
          --badge-color: #2563EB;
          --badge-bg: rgba(37,99,235, 0.09);
        }

        .account-type-card.accent-yellow {
          --accent: #eab308;
          --accent-bg: rgba(234, 179, 8, 0.06);
          --badge-border: rgba(234, 179, 8, 0.31);
          --badge-color: #eab308;
          --badge-bg: rgba(234, 179, 8, 0.09);
        }

        .account-type-card input[type="radio"] {
          accent-color: var(--accent);
        }

        .account-type-card.selected {
          border-color: var(--accent);
          background-color: var(--accent-bg);
        }

        .account-type-card:not(.selected):hover {
          border-color: rgba(255, 255, 255, 0.3);
        }

        .account-type-title {
          color: var(--accent);
        }

        .account-type-badge {
          border-color: var(--badge-border);
          color: var(--badge-color);
          background-color: var(--badge-bg);
        }
      `}</style>
    </>
  );
}
