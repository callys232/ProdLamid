"use client";

import React from "react";
import GenerateInvoiceButton from "@/components/documents/GenerateInvoiceButton";

export default function EscrowSummaryCard({
  summary,
  currency,
  onCurrencyChange,
  currencies,
  onExport,
  isPremium = false,
}: any) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-gray-400">Total Escrow Balance</div>
          <div className="text-2xl font-semibold text-white mt-1">{summary?.totalByCurrency?.[currency] ?? 0} <span className="text-sm text-gray-400">{currency}</span></div>
          <div className="text-xs text-gray-400 mt-2">Available: {summary?.availableForRelease?.[currency] ?? 0} • Disputes: {summary?.pendingDisputes}</div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <select value={currency} onChange={(e) => onCurrencyChange(e.target.value)} className="bg-gray-800 border border-gray-700 text-sm text-gray-200 px-2 py-1 rounded-md">
              {currencies.map((c: string) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={onExport} disabled={!isPremium} className={`px-3 py-2 rounded-md text-sm ${isPremium ? "bg-red-600 hover:bg-red-500 text-white" : "bg-gray-800 text-gray-400 cursor-not-allowed"}`}>
              Export
            </button>
            <GenerateInvoiceButton
              items={[{ description: "Escrow Balance", quantity: 1, unitPrice: summary?.totalByCurrency?.[currency] ?? 0 }]}
              currency={currency}
              label="Invoice"
            />
          </div>
          <div className="text-xs text-gray-400">Last updated: {new Date(summary?.lastUpdated).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
