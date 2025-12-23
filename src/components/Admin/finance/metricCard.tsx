import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function MetricCard({
  label,
  value,
  trendDelta,
}: {
  label: string;
  value: string;
  trendDelta?: number;
}) {
  const trendIcon =
    trendDelta === undefined ? null : trendDelta > 0 ? (
      <FaArrowUp className="inline text-green-400 ml-2" />
    ) : trendDelta < 0 ? (
      <FaArrowDown className="inline text-red-400 ml-2" />
    ) : null;

  return (
    <div className="bg-[#0f0f0f]/60 border border-[#1f1f1f] rounded-lg p-4 text-white shadow-sm hover:border-[#c21229] hover:shadow-lg transition-all">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-xl font-bold text-[#c21229] mt-1">
        {value} {trendIcon}
      </div>
    </div>
  );
}
