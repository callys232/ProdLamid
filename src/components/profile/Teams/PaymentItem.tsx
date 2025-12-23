"use client";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaClock } from "react-icons/fa";

interface PaymentItemProps {
  label: string;
  status: "paid" | "pending";
  amount?: number;
  dueDate?: string; // optional due date for pending payments
}

export function PaymentItem({
  label,
  status,
  amount,
  dueDate,
}: PaymentItemProps) {
  const isPaid = status === "paid";

  // Format amount consistently
  const formattedAmount =
    amount !== undefined
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
      : null;

  // Track "now" in state to avoid impure Date.now in render
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000); // update every minute
    return () => clearInterval(id);
  }, []);

  // Calculate days remaining until due
  let daysRemaining: number | null = null;
  if (!isPaid && dueDate) {
    const due = new Date(dueDate).getTime();
    const diff = Math.max(due - now, 0);
    daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // Progress percentage (closer to due date = higher %)
  const progressPercent =
    daysRemaining !== null
      ? Math.min(100, Math.max(0, 100 - daysRemaining))
      : 0;

  // Progress bar color
  const barColor =
    progressPercent >= 80
      ? "bg-red-500"
      : progressPercent >= 40
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <li
      role="listitem"
      className="flex flex-col gap-2 bg-gray-800 px-4 py-3 rounded-lg 
                 ring-1 ring-gray-700 hover:ring-2 hover:ring-red-500 
                 transition transform hover:scale-[1.02] shadow-sm"
    >
      {/* Top row: icon + label + status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isPaid ? (
            <FaCheckCircle
              className="text-green-400 hover:scale-110 transition"
              aria-label="Payment complete"
            />
          ) : (
            <FaClock
              className="text-yellow-400 hover:scale-110 transition"
              aria-label="Payment pending"
            />
          )}
          <span className="font-medium text-white">
            {label || "Unnamed Payment"}
          </span>
        </div>

        {isPaid ? (
          <span className="flex items-center gap-2">
            {formattedAmount && (
              <span className="text-green-400 font-semibold">
                {formattedAmount}
              </span>
            )}
            <span className="px-2 py-1 rounded-full bg-green-600 text-white text-xs font-bold">
              Paid
            </span>
          </span>
        ) : (
          <span className="px-2 py-1 rounded-full bg-yellow-600 text-white text-xs font-bold">
            Pending
          </span>
        )}
      </div>

      {/* Due date + progress bar */}
      {!isPaid && dueDate && (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-300">
            📅 Due in {daysRemaining} day{daysRemaining === 1 ? "" : "s"}
          </span>
          <div className="relative w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 ${barColor} transition-all duration-700`}
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-label={`Payment progress for ${label}`}
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
            <span
              className={`absolute inset-0 flex items-center justify-center text-[10px] font-semibold ${
                barColor === "bg-red-500"
                  ? "text-red-200"
                  : barColor === "bg-yellow-500"
                  ? "text-yellow-200"
                  : "text-green-200"
              }`}
            >
              {progressPercent}%
            </span>
          </div>
        </div>
      )}
    </li>
  );
}
