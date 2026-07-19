// src/components/common/Card.tsx
"use client";

import { ReactNode } from "react";

interface CardProps {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export default function Card({ title, icon, children }: CardProps) {
  const cardClass =
    "bg-[#1a0d0d] border border-blue-600 rounded-lg p-6 shadow-md transition transform hover:-translate-y-1 hover:shadow-blue-700/40 hover:border-blue-500 hover:bg-[#2a0d0d]";

  return (
    <div className={cardClass}>
      {title && (
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          {icon} {title}
        </h2>
      )}
      {children}
    </div>
  );
}
