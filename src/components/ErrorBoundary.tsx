"use client";

import React from "react";
import { motion } from "framer-motion";

interface State { hasError: boolean; error: Error | null }

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{ fallback?: React.ReactNode }>, State> {
  constructor(props: React.PropsWithChildren<{ fallback?: React.ReactNode }>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console (swap for Sentry when configured)
    console.error("[ErrorBoundary]", error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-10 text-center"
        >
          <p className="text-sm font-semibold text-red-400">Something went wrong</p>
          <p className="text-xs text-gray-500">{this.state.error?.message ?? "An unexpected error occurred."}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="rounded-lg bg-[#c12129] px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
          >
            Try again
          </button>
        </motion.div>
      );
    }
    return this.props.children;
  }
}
