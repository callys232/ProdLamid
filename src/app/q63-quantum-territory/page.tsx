"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q63Page() {
  const config = MODULE_REGISTRY["Q63"] ?? buildFallbackConfig("Q63", "Q-Series — Quantum Decision Intelligence", "Quantum Territory Engine");
  return (
    <DashboardTierGate pillar="Q63 — Quantum Territory Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
