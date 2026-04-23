"use client";

import { ReactNode } from "react";

interface DropdownProps {
  isOpen: boolean;
  children: ReactNode;
}

export function Dropdown({ isOpen, children }: DropdownProps) {
  if (!isOpen) return null;

  return (
    <div
      className="
        absolute mt-2
        w-72
        rounded-lg
        border border-red-600/40
        bg-black/90
        p-4
        shadow-lg
        animate-fadeIn
      "
    >
      {children}
    </div>
  );
}
