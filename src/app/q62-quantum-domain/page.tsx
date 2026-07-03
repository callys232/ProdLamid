"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q62Page() {
  const config = MODULE_REGISTRY["Q62"] ?? buildFallbackConfig("Q62", "Q-Series — Quantum Decision Intelligence", "Quantum Domain Engine");
  return (
    <DashboardTierGate pillar="Q62 — Quantum Domain Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
