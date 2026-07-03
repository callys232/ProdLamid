"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q41Page() {
  const config = MODULE_REGISTRY["Q41"] ?? buildFallbackConfig("Q41", "Q-Series — Quantum Decision Intelligence", "Quantum Intelligence Engine");
  return (
    <DashboardTierGate pillar="Q41 — Quantum Intelligence Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
