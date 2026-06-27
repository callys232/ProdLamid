// components/escrow/EscrowPanel.tsx
"use client";

interface EscrowPanelProps {
  balance: number;
  currency?: string;
  fundedTotal?: number;
  releasedTotal?: number;
  onFund?: () => void;
  onRelease?: () => void;
  onRefund?: () => void;
}

export default function EscrowPanel({
  balance,
  currency = "USD",
  fundedTotal = 0,
  releasedTotal = 0,
  onFund,
  onRelease,
  onRefund,
}: EscrowPanelProps) {
  return (
    <div className="bg-[#1a0d0d] border border-gray-800 rounded-xl p-6 space-y-4 shadow-xl">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-white">Escrow balance</h3>
        <span className="text-2xl font-bold text-white">
          {currency} {balance.toLocaleString()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 py-2 border-t border-gray-800">
        <div className="space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Funded</p>
          <p className="text-lg font-medium text-blue-400">{currency} {fundedTotal.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Released</p>
          <p className="text-lg font-medium text-green-400">{currency} {releasedTotal.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        {onFund && (
          <button
            onClick={onFund}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition shadow-lg shadow-red-900/20"
          >
            Fund Milestone
          </button>
        )}
        {onRelease && (
          <button
            onClick={onRelease}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition border border-gray-700"
          >
            Release Funds
          </button>
        )}
        {onRefund && (
          <button
            onClick={onRefund}
            className="px-4 py-2 bg-transparent border border-gray-700 text-gray-300 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Refund
          </button>
        )}
      </div>
    </div>
  );
}
