"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function X05Page() {
  const config = MODULE_REGISTRY["X05"] ?? buildFallbackConfig("X05", "X-Series — Protection Intelligence", "Ethics Intelligence Engine");
  return (
    <DashboardTierGate pillar="Ethics Intelligence" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
