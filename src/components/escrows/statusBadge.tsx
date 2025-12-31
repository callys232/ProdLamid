// components/escrow/StatusBadge.tsx
import { EscrowStatus } from "@/types/escrow";
import clsx from "clsx";

const statusStyles: Record<EscrowStatus, string> = {
  pending: "bg-gray-600 text-white",
  funded: "bg-blue-600 text-white",
  in_progress: "bg-yellow-500 text-black",
  released: "bg-green-600 text-white",
  completed: "bg-emerald-700 text-white",
  disputed: "bg-red-600 text-white",
};

export function StatusBadge({ status }: { status: EscrowStatus }) {
  return (
    <span
      className={clsx(
        "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        statusStyles[status]
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}
