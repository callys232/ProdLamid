"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q85Page() {
  const config = MODULE_REGISTRY["Q85"] ?? buildFallbackConfig("Q85", "Q-Series — Quantum Decision Intelligence", "Quantum Being Engine");
  return (
    <DashboardTierGate pillar="Q85 — Quantum Being Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
