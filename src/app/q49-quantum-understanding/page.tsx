"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q49Page() {
  const config = MODULE_REGISTRY["Q49"] ?? buildFallbackConfig("Q49", "Q-Series — Quantum Decision Intelligence", "Quantum Understanding Engine");
  return (
    <DashboardTierGate pillar="Q49 — Quantum Understanding Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
