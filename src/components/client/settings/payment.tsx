"use client";

import { useState } from "react";
import { z } from "zod";
import { Check, Copy } from "lucide-react";

// ✅ Zod Schema (fixed & typed)
const paymentSchema = z
  .object({
    walletAddress: z.string().optional(),
    network: z.enum(["usdt_erc20", "usdt_trc20"]).optional(),
    bankAccount: z.string().optional(),
    routingNumber: z.string().optional(),
    bankName: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // ✅ Wallet validation & network auto-detect
    if (data.walletAddress?.trim()) {
      const addr = data.walletAddress.trim();

      // ERC-20 (starts with 0x)
      if (addr.startsWith("0x")) {
        if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
          ctx.addIssue({
            path: ["walletAddress"],
            code: "custom",
            message: "Invalid ERC-20 USDT wallet address",
          });
        }
        data.network = "usdt_erc20";
      }

      // TRC-20 (starts with T)
      if (addr.startsWith("T")) {
        if (!/^T[a-zA-Z0-9]{33}$/.test(addr)) {
          ctx.addIssue({
            path: ["walletAddress"],
            code: "custom",
            message: "Invalid TRC-20 USDT wallet address",
          });
        }
        data.network = "usdt_trc20";
      }
    }

    // ✅ Bank account validation
    if (data.bankAccount?.trim() && !/^\d{10}$/.test(data.bankAccount.trim())) {
      ctx.addIssue({
        path: ["bankAccount"],
        code: "custom",
        message: "Bank account must be 10 digits",
      });
    }
  });

export default function PaymentInformation() {
  const [formData, setFormData] = useState({
    walletAddress: "",
    network: "",
    bankAccount: "",
    routingNumber: "",
    bankName: "",
  });

  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formData.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = paymentSchema.safeParse(formData);
    if (!validation.success) {
      const formatted: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        formatted[issue.path[0] as string] = issue.message;
      });
      setErrors(formatted);
      return;
    }

    setErrors({});
    console.log("✅ Payment Details Submitted:", formData);
  };

  return (
    <div className="w-full max-w-2xl p-6 bg-black/30 backdrop-blur-xl border border-red-900/30 rounded-xl shadow-xl text-white space-y-6">
      <h2 className="text-xl font-semibold tracking-wide">
        PAYMENT INFORMATION
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ✅ Wallet Address */}
        <div className="space-y-2">
          <label htmlFor="walletAddress" className="text-sm font-medium block">
            Wallet Address (USDT)
          </label>

          <div className="flex gap-2">
            <input
              id="walletAddress"
              name="walletAddress"
              type="text"
              placeholder="Paste USDT wallet address"
              title="Paste your USDT wallet address"
              value={formData.walletAddress}
              onChange={handleChange}
              className="flex-1 px-3 py-2 rounded-md bg-black/40 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-[#C12129]"
            />

            {formData.walletAddress && (
              <button
                type="button"
                onClick={handleCopy}
                title="Copy wallet address"
                className="p-2 rounded-md bg-black/40 border border-gray-700 hover:bg-[#C12129] transition"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            )}
          </div>

          {errors.walletAddress && (
            <p className="text-xs text-red-400">{errors.walletAddress}</p>
          )}
        </div>

        {/* ✅ Network */}
        <div className="space-y-2">
          <label htmlFor="network" className="text-sm font-medium block">
            Network
          </label>

          <select
            id="network"
            name="network"
            title="Select blockchain network"
            value={formData.network}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md bg-black/40 border border-gray-700 outline-none focus:ring-2 focus:ring-[#C12129]"
          >
            <option value="">Auto / Select</option>
            <option value="usdt_erc20">USDT ERC-20 (0x…)</option>
            <option value="usdt_trc20">USDT TRC-20 (T…)</option>
          </select>
        </div>

        {/* ✅ Bank Information */}
        <div className="border border-red-900/30 rounded-lg p-4 space-y-3 bg-black/20">
          <label className="text-sm font-semibold block mb-2">
            Bank Information
          </label>

          <div>
            <label htmlFor="bankAccount" className="sr-only">
              Bank Account Number
            </label>
            <input
              id="bankAccount"
              name="bankAccount"
              placeholder="Bank Account Number"
              title="Enter your 10-digit bank account number"
              value={formData.bankAccount}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-black/40 border border-gray-700 focus:ring-2 focus:ring-[#C12129]"
            />
            {errors.bankAccount && (
              <p className="text-xs text-red-400">{errors.bankAccount}</p>
            )}
          </div>

          <div>
            <label htmlFor="routingNumber" className="sr-only">
              Routing Number
            </label>
            <input
              id="routingNumber"
              name="routingNumber"
              placeholder="Routing Number (optional)"
              title="Enter your bank routing number"
              value={formData.routingNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-black/40 border border-gray-700 focus:ring-2 focus:ring-[#C12129]"
            />
          </div>

          <div>
            <label htmlFor="bankName" className="sr-only">
              Bank Name
            </label>
            <input
              id="bankName"
              name="bankName"
              placeholder="Bank Name"
              title="Enter bank name"
              value={formData.bankName}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-black/40 border border-gray-700 focus:ring-2 focus:ring-[#C12129]"
            />
          </div>
        </div>

        {/* ✅ Buttons */}
        <div className="flex gap-4 pt-3">
          <button
            type="submit"
            className="flex-1 py-2 rounded-md bg-[#C12129] hover:bg-red-700 transition font-semibold"
          >
            SAVE
          </button>

          <button
            type="reset"
            onClick={() =>
              setFormData({
                walletAddress: "",
                network: "",
                bankAccount: "",
                routingNumber: "",
                bankName: "",
              })
            }
            className="flex-1 py-2 rounded-md bg-gray-800 hover:bg-gray-700 transition"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}
