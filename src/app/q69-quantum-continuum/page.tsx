"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q69Page() {
  const config = MODULE_REGISTRY["Q69"] ?? buildFallbackConfig("Q69", "Q-Series — Quantum Decision Intelligence", "Quantum Continuum Engine");
  return (
    <DashboardTierGate pillar="Q69 — Quantum Continuum Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
