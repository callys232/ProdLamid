"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q89Page() {
  const config = MODULE_REGISTRY["Q89"] ?? buildFallbackConfig("Q89", "Q-Series — Quantum Decision Intelligence", "Quantum Sovereign Identity Engine");
  return (
    <DashboardTierGate pillar="Q89 — Quantum Sovereign Identity Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
