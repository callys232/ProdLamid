// components/ReviewPopup.tsx
"use client";

import { useEffect } from "react";
import { UserAlert } from "@/mocks/useralert";

interface ReviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: UserAlert[];
  notifications: UserAlert[];
  payments: UserAlert[];
  deadlines: UserAlert[];
  reviews: UserAlert[];
  loading?: boolean;
  error?: string | null;
}

export default function ReviewPopup({
  isOpen,
  onClose,
  alerts,
  notifications,
  payments,
  deadlines,
  reviews,
  loading,
  error,
}: ReviewPopupProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const Section = ({ title, items }: { title: string; items: UserAlert[] }) => (
    <section className="mb-6">
      <h3 className="text-xl font-semibold mb-2 text-blue-500">{title}</h3>
      {items.length ? (
        <ul className="space-y-2 max-h-48 overflow-y-auto">
          {items.map((item) => (
            <li
              key={item.id}
              className="p-3 bg-gray-900 rounded border border-gray-700 hover:border-blue-600 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-sm text-gray-300">{item.message}</p>
                </div>
                {item.status && (
                  <span className="ml-3 text-xs px-2 py-1 rounded bg-gray-700 text-white">
                    {item.status}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {new Date(item.date).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No items available.</p>
      )}
    </section>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#0B0F19] text-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 overflow-y-auto max-h-[80vh] border border-gray-800">
        <h2 className="text-2xl font-bold mb-4">All Reviews & Activity</h2>

        {loading && <p className="text-gray-400 mb-3">Loading...</p>}
        {error && (
          <div className="mb-4 p-2 bg-blue-600 text-white rounded">{error}</div>
        )}

        <Section title="Alerts" items={alerts} />
        <Section title="Notifications" items={notifications} />
        <Section title="Payments" items={payments} />
        <Section title="Deadlines" items={deadlines} />
        <Section title="Reviews" items={reviews} />

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
