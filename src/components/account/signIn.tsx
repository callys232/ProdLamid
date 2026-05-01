"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface FormData { email: string; password: string }

const ACCOUNT_TYPE_ROUTES: Record<string, string> = {
  Enterprise: "/enterprise",
  Freelancer: "/profile",
  Admin:      "/admin",
  Client:     "/client",
};

const inp = `w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400
             border border-white/10 focus:border-[#c12129] focus:ring-1 focus:ring-[#c12129]/50
             outline-none transition text-sm`;

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm]         = useState<FormData>({ email: "", password: "" });
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res    = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        const msg = result.message || "Invalid email or password";
        setError(msg);
        toast.error(msg);
        return;
      }

      const { user } = result.data;

      // Store only non-sensitive display info (cookie auth is already set by server)
      try { localStorage.setItem("user_display", JSON.stringify({ username: user.username, role: user.role })); } catch {}

      // Ask the server which dashboard this user belongs to — this is the
      // authoritative check and handles enterprise, org-role, and schema cache issues
      const accountRes = await fetch("/api/groupware/get-account");
      const accountData = accountRes.ok ? await accountRes.json() : null;

      const dest = ACCOUNT_TYPE_ROUTES[accountData?.accountType ?? ""] ?? "/client";
      toast.success(`Welcome back${user.username ? `, ${user.username}` : ""}!`);
      router.replace(dest);

    } catch {
      const msg = "Connection error. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-[#0b0b0b] to-[#1a1a1a] px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
      >
        {/* Logo */}
        <div className="mb-6 text-center">
          <span className="text-2xl font-black text-[#c12129]">Lamid</span>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Email</label>
            <input
              type="email" name="email" required
              value={form.email} onChange={handleChange}
              placeholder="you@company.com"
              className={inp}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"} name="password" required
                value={form.password} onChange={handleChange}
                placeholder="••••••••"
                className={`${inp} pr-10`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Forgot / Create */}
          <div className="flex justify-between text-xs text-gray-500">
            <a href="/forgotpassword" className="hover:text-[#c12129] transition">Forgot password?</a>
            <a href="/signup"         className="hover:text-[#c12129] transition">Create account</a>
          </div>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400"
            >
              {error}
            </motion.p>
          )}

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c12129] py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Signing in…" : "Sign In"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[11px] text-gray-600 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Google OAuth — uses our own /api/auth/google route */}
        <motion.a
          href="/api/auth/google"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </motion.a>

        <p className="mt-5 text-center text-[11px] text-gray-600">
          By signing in you agree to our{" "}
          <a href="/terms"   className="hover:text-white transition">Terms</a> &amp;{" "}
          <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>.
        </p>
      </motion.div>
    </section>
  );
}
