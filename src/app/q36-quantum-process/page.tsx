"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q36Page() {
  const config = MODULE_REGISTRY["Q36"] ?? buildFallbackConfig("Q36", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Process Engine");
  return (
    <DashboardTierGate pillar="Q36 — Quantum Decision Process Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
