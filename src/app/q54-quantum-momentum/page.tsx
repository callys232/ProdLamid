"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q54Page() {
  const config = MODULE_REGISTRY["Q54"] ?? buildFallbackConfig("Q54", "Q-Series — Quantum Decision Intelligence", "Quantum Momentum Engine");
  return (
    <DashboardTierGate pillar="Q54 — Quantum Momentum Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
