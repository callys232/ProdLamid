"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q27Page() {
  const config = MODULE_REGISTRY["Q27"] ?? buildFallbackConfig("Q27", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Identity Engine");
  return (
    <DashboardTierGate pillar="Q27 — Quantum Decision Identity Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
