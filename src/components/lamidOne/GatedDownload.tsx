"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useGate } from "@/contexts/GateContext";

interface GatedDownloadProps {
  /** Called when the user is a member and clicks download */
  onDownload: () => void;
  /** Button label */
  label?: string;
  className?: string;
}

/**
 * Renders a download button for members. For non-members, renders a link
 * to sign up (unauthenticated) or upgrade (free tier) instead.
 */
export default function GatedDownload({ onDownload, label = "Download Results", className = "" }: GatedDownloadProps) {
  const { mode } = useGate();

  if (mode === "full") {
    return (
      <button type="button" onClick={onDownload} className={className}>
        {label}
      </button>
    );
  }

  const href = mode === "preview-auth" ? "/signup" : "/pricing";
  const gateLabel = mode === "preview-auth" ? "Sign up to download" : "Upgrade to download";

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <Lock className="w-3.5 h-3.5 shrink-0 opacity-50" />
      <span>{gateLabel}</span>
    </Link>
  );
}
