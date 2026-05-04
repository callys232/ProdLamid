"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

interface SecurityForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SecuritySettings({ user }: { user: any }) {
  const [twoFAEnabled, setTwoFAEnabled] = useState(user?.twoFAEnabled || false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<SecurityForm>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as keyof SecurityForm]: value }));
  };

  /* -------------------- Password Update -------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        })
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Password updated successfully! 🔐");
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        throw new Error(result.message || "Failed to update password");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- 2FA Flow -------------------- */
  const [otpSent,   setOtpSent]   = useState(false);
  const [otp,       setOtp]       = useState("");
  const [disablePwd, setDisablePwd] = useState("");

  const send2FACode = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/enable", { method: "POST" });
      const d   = await res.json();
      if (!res.ok) throw new Error(d.message);
      setOtpSent(true);
      toast.success("Verification code sent to your email");
    } catch (err: any) {
      toast.error(err.message || "Failed to send code");
    } finally { setLoading(false); }
  };

  const verify2FA = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otp }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message);
      setTwoFAEnabled(true); setOtpSent(false); setOtp("");
      toast.success("2FA enabled! 🛡️");
    } catch (err: any) {
      toast.error(err.message || "Invalid code");
    } finally { setLoading(false); }
  };

  const disable2FA = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/disable", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: disablePwd }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message);
      setTwoFAEnabled(false); setDisablePwd("");
      toast.success("2FA disabled");
    } catch (err: any) {
      toast.error(err.message || "Failed to disable 2FA");
    } finally { setLoading(false); }
  };

  const getPasswordStrength = (password: string) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const length = password.length;

    if (length >= 8 && hasUpper && hasLower && hasNumber && hasSymbol)
      return "strong";
    if (length >= 6 && ((hasUpper && hasLower) || (hasNumber && hasLower)))
      return "medium";
    return "weak";
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl p-6 bg-black/30 backdrop-blur-xl border border-red-900/30 rounded-xl shadow-xl text-white space-y-6"
    >
      <h2 className="text-xl font-semibold tracking-wide">SECURITY SETTINGS</h2>

      <div className="space-y-3">
        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>

        {!twoFAEnabled ? (
          !otpSent ? (
            <button onClick={send2FACode} disabled={loading}
              className="bg-gray-800 hover:bg-gray-700 py-2 rounded-md font-semibold disabled:opacity-50 w-full">
              {loading ? "Sending…" : "Enable Email 2FA"}
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-gray-400">Enter the 6-digit code sent to your email.</p>
              <input value={otp} onChange={e => setOtp(e.target.value)} maxLength={6}
                placeholder="000000"
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-center text-lg font-mono text-white tracking-widest focus:border-[#c12129] focus:outline-none" />
              <div className="flex gap-2">
                <button onClick={verify2FA} disabled={loading || otp.length !== 6}
                  className="flex-1 rounded-md bg-[#c12129] py-2 text-sm font-bold text-white disabled:opacity-50">
                  {loading ? "Verifying…" : "Verify & Enable"}
                </button>
                <button onClick={() => { setOtpSent(false); setOtp(""); }}
                  className="rounded-md border border-white/10 px-3 py-2 text-xs text-gray-400">
                  Cancel
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-green-400">✓ Two-factor authentication is active</p>
            <input value={disablePwd} onChange={e => setDisablePwd(e.target.value)}
              type="password" placeholder="Enter your password to disable"
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none" />
            <button onClick={disable2FA} disabled={loading || !disablePwd}
              className="rounded-md bg-red-700 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-red-800">
              {loading ? "Disabling…" : "Disable 2FA"}
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          ["oldPassword", "Old Password"],
          ["newPassword", "New Password"],
          ["confirmPassword", "Confirm Password"],
        ].map(([key, label]) => (
          <div key={key} className="space-y-1">
            <label htmlFor={key} className="text-sm font-medium block">
              {label}
            </label>
            <input
              id={key}
              name={key}
              type="password"
              placeholder={label}
              value={formData[key as keyof SecurityForm]}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-black/40 border border-gray-700"
              aria-label={label}
            />
          </div>
        ))}

        {formData.newPassword && (
          <p
            className={`text-sm ${passwordStrength === "strong"
              ? "text-green-400"
              : passwordStrength === "medium"
                ? "text-yellow-400"
                : "text-red-400"
              }`}
          >
            Password strength: {passwordStrength}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-3">
          <button
            type="submit"
            disabled={
              loading ||
              !formData.newPassword ||
              formData.newPassword !== formData.confirmPassword
            }
            className="flex-1 py-2 rounded-md bg-[#C12129] hover:bg-red-700 font-semibold"
          >
            Update Password
          </button>
        </div>
      </form>
    </motion.div>
  );
}
