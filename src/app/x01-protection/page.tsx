"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function X01Page() {
  const config = MODULE_REGISTRY["X01"] ?? buildFallbackConfig("X01", "X-Series — Protection Intelligence", "Enterprise Protection Engine");
  return (
    <DashboardTierGate pillar="Enterprise Protection" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
