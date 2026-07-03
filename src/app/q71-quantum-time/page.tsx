"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q71Page() {
  const config = MODULE_REGISTRY["Q71"] ?? buildFallbackConfig("Q71", "Q-Series — Quantum Decision Intelligence", "Quantum Time Engine");
  return (
    <DashboardTierGate pillar="Q71 — Quantum Time Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
