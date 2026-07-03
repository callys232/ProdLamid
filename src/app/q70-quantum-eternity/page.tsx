"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q70Page() {
  const config = MODULE_REGISTRY["Q70"] ?? buildFallbackConfig("Q70", "Q-Series — Quantum Decision Intelligence", "Quantum Eternity Engine");
  return (
    <DashboardTierGate pillar="Q70 — Quantum Eternity Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
