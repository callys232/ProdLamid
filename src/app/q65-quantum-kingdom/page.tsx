"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q65Page() {
  const config = MODULE_REGISTRY["Q65"] ?? buildFallbackConfig("Q65", "Q-Series — Decision Intelligence", "Enterprise-Wide Decision Map Engine");
  return (
    <DashboardTierGate pillar="Q65 — Enterprise-Wide Decision Map Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
