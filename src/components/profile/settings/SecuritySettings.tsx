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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
          newPassword: formData.newPassword,
        }),
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

  const toggle2FA = async (enable: boolean) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twoFAEnabled: enable }),
      });

      const result = await res.json();
      if (result.success) {
        setTwoFAEnabled(enable);
        toast.success(enable ? "2FA Enabled! 🛡️" : "2FA Disabled");
      } else {
        throw new Error(result.message || "Failed to toggle 2FA");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const length = password.length;

    if (length >= 8 && hasUpper && hasLower && hasNumber && hasSymbol) return "strong";
    if (length >= 6 && ((hasUpper && hasLower) || (hasNumber && hasLower))) return "medium";
    return "weak";
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl p-6 bg-black/30 backdrop-blur-xl border border-blue-900/30 rounded-xl shadow-xl text-white space-y-6"
    >
      {/* ======== 2FA Section ======== */}
      <div data-guide="security-2fa" className="space-y-3">
        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
        {!twoFAEnabled ? (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => toggle2FA(true)}
              disabled={loading}
              className="bg-gray-800 hover:bg-gray-700 py-2 rounded-md font-semibold disabled:opacity-50"
            >
              Enable Email 2FA
            </button>
            <button
              onClick={() => toggle2FA(true)}
              disabled={loading}
              className="bg-gray-800 hover:bg-gray-700 py-2 rounded-md font-semibold disabled:opacity-50"
            >
              Use Google Authenticator
            </button>
          </div>
        ) : (
          <button
            onClick={() => toggle2FA(false)}
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-800 py-2 rounded-md font-semibold disabled:opacity-50"
          >
            Disable 2FA
          </button>
        )}
      </div>

      {/* ======== Password Update Section ======== */}
      <form onSubmit={handleSubmit} data-guide="security-password" className="space-y-5">
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
            />
          </div>
        ))}

        {formData.newPassword && (
          <p
            className={`text-sm ${passwordStrength === "strong"
                ? "text-green-400"
                : passwordStrength === "medium"
                  ? "text-yellow-400"
                  : "text-blue-400"
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
            className="flex-1 py-2 rounded-md bg-[#2563EB] hover:bg-blue-700 font-semibold"
          >
            Update Password
          </button>
        </div>
      </form>
    </motion.div>
  );
}