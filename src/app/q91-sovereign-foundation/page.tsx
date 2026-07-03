"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q91Page() {
  const config = MODULE_REGISTRY["Q91"] ?? buildFallbackConfig("Q91", "Q-Series — Quantum Decision Intelligence", "Sovereign Foundation Engine");
  return (
    <DashboardTierGate pillar="Q91 — Sovereign Foundation Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
