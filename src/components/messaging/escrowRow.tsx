"use client";

interface EscrowRowProps {
  label: string;
  value: string;
}

export function EscrowRow({ label, value }: EscrowRowProps) {
  return (
    <div className="flex justify-between gap-4 text-sm transition-all">
      <span className="text-gray-400">{label}:</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
