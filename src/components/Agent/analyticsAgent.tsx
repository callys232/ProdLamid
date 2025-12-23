import React from "react";

export default function AnalyticsAgent() {
  return (
    <div className="bg-[#010101] p-6 rounded-lg border border-[#1f1f1f]">
      <h3 className="text-lg font-semibold">📊 Analytics & Recommendation</h3>
      <p className="text-gray-400">Efficiency score: 78%</p>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <ChartCard label="Progress" value="60%" color="bg-[#14b8a6]" />
        <ChartCard label="Workload" value="120%" color="bg-[#10b981]" />
        <ChartCard label="Profitability" value="23%" color="bg-[#14b8a6]" />
      </div>

      <div className="bg-[#1a1a1a] p-4 rounded-lg mt-4 border border-[#14b8a6]">
        <h4 className="font-semibold text-[#10b981]">Bottleneck detected</h4>
        <p className="text-sm text-gray-400">Consultant A overloaded (120%).</p>
        <button className="mt-2 px-3 py-1 bg-gradient-to-r from-[#14b8a6] to-[#10b981] text-white rounded hover:opacity-90 transition">
          View recommendation
        </button>
      </div>
    </div>
  );
}

function ChartCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
      <p className="text-sm text-gray-400">{label}</p>
      <div className="bg-[#333] h-2 rounded mt-2">
        <div className={`${color} h-2 rounded`} style={{ width: value }} />
      </div>
      <p className="text-xs text-gray-400 mt-2">{value}</p>
    </div>
  );
}
