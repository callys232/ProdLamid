"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A09Page() {
  const config = MODULE_REGISTRY["A09"] ?? buildFallbackConfig("A09", "A-Series — TALENT Intelligence", "Talent Opportunity Intelligence Engine");
  return (
    <DashboardTierGate pillar="Talent Opportunity Intelligence Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
