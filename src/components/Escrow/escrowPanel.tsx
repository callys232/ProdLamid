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
    <div className="bg-white border border-[#c21219] rounded-lg p-4 space-y-3">
      <h3 className="text-lg font-semibold text-[#c21219]">Escrow</h3>
      <div className="flex justify-between">
        <span className="text-sm text-gray-600">Balance</span>
        <span className="text-xl font-bold">
          {currency} {balance.toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between text-sm text-gray-700">
        <span>
          Funded: {currency} {fundedTotal.toLocaleString()}
        </span>
        <span>
          Released: {currency} {releasedTotal.toLocaleString()}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onFund}
          className="px-3 py-2 bg-[#c21219] text-white rounded-md hover:bg-red-700"
        >
          Fund
        </button>
        <button
          onClick={onRelease}
          className="px-3 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Release
        </button>
        <button
          onClick={onRefund}
          className="px-3 py-2 bg-white border border-[#c21219] text-black rounded-md hover:bg-black hover:text-white"
        >
          Refund
        </button>
      </div>
    </div>
  );
}
