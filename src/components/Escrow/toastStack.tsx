// components/ui/ToastStack.tsx
"use client";
import type { Toast } from "./useToast";

interface ToastStackProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export default function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-2 rounded-md shadow text-white flex items-center justify-between gap-4 ${
            t.variant === "success"
              ? "bg-green-600"
              : t.variant === "error"
              ? "bg-red-600"
              : "bg-gray-800"
          }`}
        >
          <span>{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            className="text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
