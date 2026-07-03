"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q95Page() {
  const config = MODULE_REGISTRY["Q95"] ?? buildFallbackConfig("Q95", "Q-Series — Quantum Decision Intelligence", "Sovereign Mandate Engine");
  return (
    <DashboardTierGate pillar="Q95 — Sovereign Mandate Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
