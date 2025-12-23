"use client";
import React, { ReactNode } from "react";
import {
  FaExclamationCircle,
  FaClock,
  FaCreditCard,
  FaCheckCircle,
} from "react-icons/fa";

interface AlertItemProps {
  message: string;
  type: "overdue" | "upcoming" | "payment" | "success";
}

const alertConfig: Record<
  AlertItemProps["type"],
  { icon: ReactNode; style: string }
> = {
  overdue: {
    icon: <FaExclamationCircle className="text-red-400" aria-hidden="true" />,
    style: "border-red-600 bg-red-900/40 text-red-100",
  },
  upcoming: {
    icon: <FaClock className="text-yellow-400" aria-hidden="true" />,
    style: "border-yellow-600 bg-yellow-900/40 text-yellow-100",
  },
  payment: {
    icon: <FaCreditCard className="text-blue-400" aria-hidden="true" />,
    style: "border-blue-600 bg-blue-900/40 text-blue-100",
  },
  success: {
    icon: <FaCheckCircle className="text-green-400" aria-hidden="true" />,
    style: "border-green-600 bg-green-900/40 text-green-100",
  },
};

export function AlertItem({ message, type }: AlertItemProps) {
  const config = alertConfig[type];

  return (
    <li
      role="alert"
      aria-live="polite"
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-sm 
                  transition hover:shadow-md hover:scale-[1.02] ${config.style}`}
    >
      <span className="text-lg">{config.icon}</span>
      <p className="text-sm font-medium">{message}</p>
    </li>
  );
}
