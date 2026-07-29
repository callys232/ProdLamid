"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function X04Page() {
  const config = MODULE_REGISTRY["X04"] ?? buildFallbackConfig("X04", "X-Series — Protection Intelligence", "Compliance Intelligence Engine");
  return (
    <DashboardTierGate pillar="Compliance Intelligence" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
