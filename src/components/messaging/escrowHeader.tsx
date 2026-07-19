"use client";

import { Scale } from "lucide-react";
import { StatusBadge } from "./statusBadge";
import type { EscrowStatus } from "@/types/escrow";

export function EscrowHeader({
  balance,
  status,
}: {
  balance: number;
  status?: EscrowStatus;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Scale className="h-5 w-5 text-blue-500" />
        <span className="text-sm font-semibold uppercase tracking-wide text-blue-500">
          Escrow
        </span>

        {status && <StatusBadge status={status} />}
      </div>

      <span className="text-lg font-bold text-white">
        ${balance.toLocaleString()}
      </span>
    </div>
  );
}
