"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface SecurityForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SecuritySettings() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [useGoogleAuth, setUseGoogleAuth] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
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

  const sendEmailOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setEmailSent(true);
      setShowOtpModal(true);
      setLoading(false);
      toast.success("OTP sent to your email");
    }, 900);
  };

  const enableGoogleAuth = () => {
    setLoading(true);
    setTimeout(() => {
      setUseGoogleAuth(true);
      setQrCodeUrl("/placeholder-qr.png");
      toast.success("Scan QR Code in Google Authenticator");
      setShowOtpModal(true);
      setLoading(false);
    }, 900);
  };

  const verifyOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setTwoFAEnabled(true);
      setShowOtpModal(false);
      setOtp("");
      toast.success("2FA Enabled Successfully");
      setLoading(false);
    }, 900);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Password updated");
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
          <div className="flex flex-col gap-3">
            <button
              onClick={sendEmailOtp}
              disabled={loading}
              aria-label="Enable Email 2FA"
              className="bg-gray-800 hover:bg-gray-700 py-2 rounded-md font-semibold"
            >
              Enable Email 2FA
            </button>
            <button
              onClick={enableGoogleAuth}
              disabled={loading}
              aria-label="Enable Google Authenticator"
              className="bg-gray-800 hover:bg-gray-700 py-2 rounded-md font-semibold"
            >
              Use Google Authenticator
            </button>
          </div>
        ) : (
          <button
            onClick={() => setTwoFAEnabled(false)}
            aria-label="Disable 2FA"
            className="bg-red-700 hover:bg-red-800 py-2 rounded-md font-semibold"
          >
            Disable 2FA
          </button>
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
            className={`text-sm ${
              passwordStrength === "strong"
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

      {showOtpModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 p-6 rounded-xl w-80 space-y-4 text-center"
          >
            <h3 className="font-semibold text-lg">Verify OTP</h3>
            {useGoogleAuth && qrCodeUrl && (
              <Image
                src={qrCodeUrl}
                alt="QR Code"
                width={160}
                height={160}
                className="mx-auto"
              />
            )}
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-3 py-2 rounded-md bg-black/40 border border-gray-700"
              aria-label="Enter OTP"
            />
            <button
              onClick={verifyOtp}
              disabled={loading || otp.length < 4}
              className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-md font-semibold"
            >
              Verify
            </button>
            <button
              onClick={() => setShowOtpModal(false)}
              className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-md"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
