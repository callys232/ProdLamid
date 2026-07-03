"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q04Page() {
  const config = MODULE_REGISTRY["Q04"] ?? buildFallbackConfig("Q04", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Probability Engine");
  return (
    <DashboardTierGate pillar="Q04 — Quantum Decision Probability Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
