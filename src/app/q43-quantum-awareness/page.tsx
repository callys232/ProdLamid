"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q43Page() {
  const config = MODULE_REGISTRY["Q43"] ?? buildFallbackConfig("Q43", "Q-Series — Quantum Decision Intelligence", "Quantum Awareness Engine");
  return (
    <DashboardTierGate pillar="Q43 — Quantum Awareness Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
